/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcreate_wasm_app"] = self["webpackChunkcreate_wasm_app"] || []).push([["src_id3-editor_index_js"],{

/***/ "./src/id3-editor/index.js":
/*!*********************************!*\
  !*** ./src/id3-editor/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var id3_rw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! id3-rw */ \"../package/index.js\");\n// eslint-disable-next-line camelcase\n\n\nconst metadataInputs = document.querySelectorAll('*[data-name]')\nconst metadataEditor = document.getElementById('metadata-editor')\nconst uploadInput = document.getElementById('upload')\n\n// Variables for global state management\nlet currentBufferPromise\nlet currentTagControllerPromise\nlet currentFileName\n\nconst initMetadataEditor = (tagController) => {\n  // Show the metadata editor\n  metadataEditor.classList.remove('invisible')\n\n  // Initalise metadata inputs\n  const metadata = tagController.get_metadata()\n  for (const metadataInput of metadataInputs) {\n    const value = String(metadata[metadataInput.dataset.name] || '').trim()\n    metadataInput.dataset.originalValue = value\n    metadataInput.value = value\n\n    // Trigger removing the \"changed\" labels\n    if (metadataInput.oninput) {\n      metadataInput.oninput()\n    }\n  }\n  metadata.free()\n}\n\n// Show \"changed\" labels if the input's data changed\n// compared to it's original state\n// (which was set when the current file was loaded).\nfor (const metadataInput of metadataInputs) {\n  const isChangedElement = document.createElement('span')\n  isChangedElement.appendChild(document.createTextNode(' (changed)'))\n  isChangedElement.style.display = 'none'\n  metadataInput.parentNode.appendChild(isChangedElement)\n\n  metadataInput.oninput = () => {\n    const isChanged =\n      typeof metadataInput.dataset.originalValue !== 'undefined' &&\n      metadataInput.dataset.originalValue !== metadataInput.value.trim()\n\n    metadataInput.dataset.isChanged = isChanged\n    isChangedElement.style.display = isChanged ? 'inline' : 'none'\n  }\n}\n\nconst downloadBlob = (blob, fileName) => {\n  const a = document.createElement('a')\n  a.href = URL.createObjectURL(blob)\n  a.download = fileName\n  a.click()\n}\n\nmetadataEditor.addEventListener('submit', async e => {\n  e.preventDefault()\n\n  const [buffer, tagController] = await Promise.all([\n    currentBufferPromise,\n    currentTagControllerPromise\n  ])\n\n  for (const metadataInput of metadataInputs) {\n    if (metadataInput.dataset.isChanged !== 'true') {\n      continue\n    }\n    const value = metadataInput.value.trim()\n    if (value === '') {\n      tagController['remove_' + metadataInput.dataset.name](value)\n    } else {\n      tagController['set_' + metadataInput.dataset.name](value)\n    }\n  }\n\n  downloadBlob(\n    new Blob([\n      tagController.put_tag_into(buffer)\n    ]),\n    currentFileName\n  )\n})\n\nuploadInput.addEventListener('input', async () => {\n  const file = uploadInput.files[0]\n  if (!file) return\n\n  // Free up the current tag controller\n  if (currentTagControllerPromise) {\n    metadataEditor.classList.add('invisible')\n    currentTagControllerPromise.then(tagController => {\n      tagController.free()\n    })\n  }\n\n  const tagControllerPromise = (0,id3_rw__WEBPACK_IMPORTED_MODULE_0__.create_tag_controller_from)(file.stream())\n  currentTagControllerPromise = tagControllerPromise\n  currentFileName = file.name\n  currentBufferPromise = file.arrayBuffer().then(buffer => new Uint8Array(buffer))\n\n  tagControllerPromise.then(tagController => {\n    // If the tagControllerPromise is not the current one,\n    // then tagController is obsolete so it should not be loaded\n    // into the editor.\n    if (tagControllerPromise !== currentTagControllerPromise) return\n    initMetadataEditor(tagController)\n  })\n})\n\nuploadInput.disabled = false\n\n\n//# sourceURL=webpack://create-wasm-app/./src/id3-editor/index.js?");

/***/ })

}]);