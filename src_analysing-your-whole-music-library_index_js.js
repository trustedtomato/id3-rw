/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkcreate_wasm_app"] = self["webpackChunkcreate_wasm_app"] || []).push([["src_analysing-your-whole-music-library_index_js"],{

/***/ "./src/analysing-your-whole-music-library/index.js":
/*!*********************************************************!*\
  !*** ./src/analysing-your-whole-music-library/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var id3_rw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! id3-rw */ \"../package/index.js\");\n\n\nconst selectButton = document.getElementById('select')\nconst trackList = document.getElementById('tracks')\n\nasync function * readdir (fileHandle) {\n  yield fileHandle\n  if (fileHandle.kind === 'directory') {\n    for await (const childFileHandle of fileHandle.values()) {\n      yield * readdir(childFileHandle)\n    }\n  }\n}\n\nselectButton.addEventListener('click', async () => {\n  const dirHandle = await window.showDirectoryPicker()\n  for await (const entry of readdir(dirHandle)) {\n    if (entry.kind === 'file') {\n      const file = await entry.getFile()\n      const stream = await file.stream()\n      const metadata = await (0,id3_rw__WEBPACK_IMPORTED_MODULE_0__.getMetadataFrom)(stream)\n      const trackListItem = document.createElement('div')\n      trackListItem.classList.add('track')\n\n      if (metadata) {\n        const img = document.createElement('img')\n\n        const albumCover = metadata.albumCover\n        if (albumCover) {\n          img.src = URL.createObjectURL(\n            new Blob([albumCover.data.buffer]),\n            { type: albumCover.mimeType }\n          )\n          trackListItem.appendChild(img)\n          albumCover.free()\n        }\n\n        const textMetadata = document.createElement('div')\n\n        for (const x of [\n          'title',\n          'artist',\n          'album',\n          'albumArtist',\n          'year'\n        ]) {\n          const text = document.createElement('div')\n          text.appendChild(document.createTextNode(\n            `${x}: ${metadata[x] || `UNKNOWN_${x.toUpperCase()}`}`\n          ))\n          textMetadata.appendChild(text)\n        }\n\n        trackListItem.appendChild(textMetadata)\n\n        metadata.free()\n      } else {\n        trackListItem.appendChild(\n          document.createTextNode(\n            `${file.name} = UNKNOWN_METADATA`\n          )\n        )\n      }\n      trackList.appendChild(trackListItem)\n    }\n  }\n})\n\n\n//# sourceURL=webpack://create-wasm-app/./src/analysing-your-whole-music-library/index.js?");

/***/ })

}]);