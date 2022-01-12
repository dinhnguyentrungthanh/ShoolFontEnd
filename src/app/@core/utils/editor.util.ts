export class EditorUtils {

  public static formatData(input: string): string {
    const imageWidgetCaption = /<div class="ck-fake-selection-container" style="position: fixed; top: 0px; left: -9999px; width: 42px;">(.+)<\/div>/gi;
    const videoWidgetTag = `<div class="ck-fake-selection-container" style="position: fixed; top: 0px; left: -9999px; width: 42px;">media widget</div>`;
    const videoIcon = `<div class="ck ck-reset_all ck-widget__type-around"><div class="ck ck-widget__type-around__button ck-widget__type-around__button_before" title="Insert paragraph before block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8"><path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038"></path></svg></div><div class="ck ck-widget__type-around__button ck-widget__type-around__button_after" title="Insert paragraph after block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8"><path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038"></path></svg></div><div class="ck ck-widget__type-around__fake-caret"></div></div>`;
    const imageWidgetTag = `<div class="ck-fake-selection-container" style="position: fixed; top: 0px; left: -9999px; width: 42px;">image widget</div>`;
    const brTag = `<p><br data-cke-filler="true"></p>`;
    return input.replaceAll(videoWidgetTag, ``)
    .replaceAll(videoIcon, ``)
    .replaceAll(imageWidgetTag, ``)
    .replaceAll(imageWidgetCaption, ``)
    .replaceAll(brTag, ``);
  }

  public static getSelector(selectorId?: string): Element | null {
    const selector = `.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline`;
    if (selectorId && selectorId.trim().length > 0){
      return document.querySelector(`${selectorId} ${selector}`);
    }
    return document.querySelector(`${selector}`);
  }
}
