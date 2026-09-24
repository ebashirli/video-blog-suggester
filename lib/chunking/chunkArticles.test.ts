import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import * as cheerio from 'cheerio'
import { chunkArticles } from './chunkArticles'

function chunk(html: string) {
  const $ = cheerio.load(`<main>${html}</main>`)
  return chunkArticles($, $('main').get(0)!)
}

describe('chunkArticles', () => {
  it('returns no chunks for empty content', () => {
    assert.deepEqual(chunk(''), [])
    assert.deepEqual(chunk('   \n  '), [])
  })

  it('returns a single chunk when there is no h2', () => {
    assert.deepEqual(chunk('<p>Hello world</p>'), ['Hello world'])
  })

  it('starts a new chunk at each h2, with the heading first and a blank line after it', () => {
    assert.deepEqual(
      chunk(`
        <h2>First</h2>
        <p>One</p>
        <h2>Second</h2>
        <p>Two</p>
      `),
      ['First\n\nOne', 'Second\n\nTwo'],
    )
  })

  it('puts text before the first h2 into its own chunk', () => {
    assert.deepEqual(chunk('<p>Intro</p><h2>Section</h2><p>Body</p>'), [
      'Intro',
      'Section\n\nBody',
    ])
  })

  it('finds h2 elements nested inside wrapper elements', () => {
    assert.deepEqual(
      chunk(`
        <div class="wrapper">
          <section><h2>Nested</h2><p>Inside</p></section>
        </div>
      `),
      ['Nested\n\nInside'],
    )
  })

  it('keeps a heading with no body as its own chunk', () => {
    assert.deepEqual(chunk('<h2>Empty</h2><h2>Full</h2><p>Body</p>'), [
      'Empty',
      'Full\n\nBody',
    ])
  })

  it('flattens inline markup and whitespace inside h2', () => {
    assert.deepEqual(chunk('<h2>  Using\n  <code>useState</code>  </h2><p>x</p>'), [
      'Using useState\n\nx',
    ])
  })

  it('does not split on other heading levels', () => {
    assert.deepEqual(chunk('<h2>Top</h2><h3>Sub</h3><p>Body</p>'), [
      'Top\n\nSub\n\nBody',
    ])
  })

  it('keeps inline elements on the same line', () => {
    assert.deepEqual(chunk('<p>Hello <strong>bold</strong> and <a href="#">link</a>.</p>'), [
      'Hello bold and link.',
    ])
  })

  it('separates block elements with a blank line', () => {
    assert.deepEqual(chunk('<p>One</p><p>Two</p>'), ['One\n\nTwo'])
    assert.deepEqual(chunk('<ul><li>a</li><li>b</li></ul>'), ['a\n\nb'])
  })

  it('collapses whitespace in normal text', () => {
    assert.deepEqual(chunk('<p>  lots   of \n\n  space  </p>'), ['lots of space'])
  })

  it('never produces more than one blank line in a row', () => {
    const [result] = chunk('<div><div><div><p>a</p></div></div></div><div><div><p>b</p></div></div>')
    assert.equal(result, 'a\n\nb')
  })

  it('preserves whitespace inside pre, including nested code', () => {
    assert.deepEqual(
      chunk('<pre><code>function f() {\n    return 1\n}</code></pre>'),
      ['function f() {\n    return 1\n}'],
    )
  })

  it('skips script, style, noscript, template, svg and iframe content', () => {
    assert.deepEqual(
      chunk(`
        <p>Visible</p>
        <script>alert(1)</script>
        <style>p { color: red }</style>
        <noscript>No JS</noscript>
        <template><p>Template</p></template>
        <svg><text>Svg text</text></svg>
        <iframe src="x"></iframe>
      `),
      ['Visible'],
    )
  })

  it('skips h2 elements inside skipped tags', () => {
    assert.deepEqual(chunk('<p>Body</p><template><h2>Hidden</h2></template>'), ['Body'])
  })

  it('works on a realistic article', () => {
    assert.deepEqual(
      chunk(`
        <p>React hooks let you use state in <em>function</em> components.</p>
        <h2 id="use-state">useState</h2>
        <p>Returns a value and a setter:</p>
        <pre><code>const [count, setCount] = useState(0)</code></pre>
        <h2 id="use-effect">useEffect</h2>
        <p>Runs side effects.</p>
        <ul><li>After render</li><li>On dependency change</li></ul>
      `),
      [
        'React hooks let you use state in function components.',
        'useState\n\nReturns a value and a setter:\n\nconst [count, setCount] = useState(0)',
        'useEffect\n\nRuns side effects.\n\nAfter render\n\nOn dependency change',
      ],
    )
  })
})
