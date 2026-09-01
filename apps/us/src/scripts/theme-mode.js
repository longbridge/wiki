;(function () {
  var d = document.documentElement
  var KEY = 'lb-theme-mode'
  function fromQuery() {
    try { var m = new URLSearchParams(location.search).get('theme'); return m === 'dark' || m === 'light' ? m : null } catch (e) { return null }
  }
  function fromUA() {
    var m = navigator.userAgent.match(/lbtheme\/(dark|light)/i)
    return m ? m[1].toLowerCase() : null
  }
  function fromStore() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null } catch (e) { return null }
  }
  function fromSystem() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : null
  }
  var overridden = !!(fromQuery() || fromUA())
  function resolve() { return fromQuery() || fromUA() || fromStore() || fromSystem() || 'light' }
  function apply(mode) {
    d.setAttribute('theme', mode)
    d.classList.remove('theme-light', 'theme-dark')
    d.classList.add('theme-' + mode)
    var syncBody = function () { if (document.body) document.body.setAttribute('theme', mode) }
    document.body ? syncBody() : document.addEventListener('DOMContentLoaded', syncBody)
    try { document.dispatchEvent(new CustomEvent('lb:theme-change', { detail: { mode: mode } })) } catch (e) {}
  }
  apply(resolve())
  window.lbGetThemeMode = function () { return d.getAttribute('theme') || 'light' }
  window.lbSetThemeMode = function (mode, persist) {
    if (mode !== 'dark' && mode !== 'light') return
    if (persist !== false) { try { localStorage.setItem(KEY, mode) } catch (e) {} }
    apply(mode)
  }
  window.changeTheme = function (name) { window.lbSetThemeMode(name === 'dark-theme' ? 'dark' : 'light', false) }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)')
    var onChange = function () { if (!overridden && !fromStore()) apply(resolve()) }
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
  }
  // Whale App 检测 (spec §8.4)
  if (/lbcommitid/i.test(navigator.userAgent)) d.classList.add('is-whale-app')
})()
