import './style.css'
import { mount } from 'svelte'
import App from './App.svelte'

// Mount the Svelte application to the #app element
mount(App, {
	target: document.querySelector('#app')!,
})
