/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { MyUploadAdapter } from '../model/upload-adapter';


function MyCustomUploadAdapterPlugin( editor: any ) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader: any  ) =>
      // Configure the URL to the upload script in your back-end here!
       new MyUploadAdapter( loader )
  ;
}

export const toolBar = {
  extraPlugins: [ MyCustomUploadAdapterPlugin ],
  toolbar: {
    items: [
      'heading', '|',
      'alignment', '|',
      'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
      'link', '|',
      'bulletedList', 'numberedList',
      'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
      'codeBlock', '|',
      'insertTable', '|',
      'outdent', 'indent', '|',
      'blockQuote', '|',
      'undo', 'redo', '|',
      'insertImage', 'mediaEmbed', '|',
      'MathType', 'specialCharacters', 'ChemType'
    ],
    shouldNotGroupWhenFull: true
  },
  language: 'en',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:full',
      'imageStyle:side']
  },
  mediaEmbed: {
    previewsInData: true
  }
};
