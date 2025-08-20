// This is a polyfill for the 'global' object which is expected by some Node.js modules
// when they're used in browser environments
window.global = window;
