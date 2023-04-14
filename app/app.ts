/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first page.
*/

import CollectionViewElement from "@nativescript-community/ui-collectionview/svelte";


import { svelteNativeNoFrame } from 'svelte-native'
import App from './App.svelte'

CollectionViewElement.register();

svelteNativeNoFrame(App, {})
