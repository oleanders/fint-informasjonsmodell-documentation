import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { EABaseClass } from './EABaseClass';
import { EALinkBase } from './EALinkBase';
import { Classification } from './Classification';

import { ExpandablePipe } from '../../views/result/pipes/expandable.pipe';

import * as D3 from 'app/d3.bundle';

export class Association extends EALinkBase {
  static pipe = new ExpandablePipe();
  static markPipe = new MarkdownToHtmlPipe()

  static umlId = 'uml:Association';
  parent: any;
  extension: any;

  private _isOpen: boolean = false;
  get isOpen() { return this._isOpen; }
  set isOpen(flag) {
    this._isOpen = flag;
  }

  get label() {
    return this.extension.labels[0].rt;
  }

  get multiplicity() {
    return this.extension.labels[0].rb;
  }

  private _isVisible: boolean;
  private _lastSearch: string;
  public isAssocVisible(classification: Classification): boolean {
    const str = EABaseClass.service.searchString;
    if (str && str.length > 0) {
      if (str == this._lastSearch) { return this._isVisible; }
      const meVisible = super.isVisible();
      const typeVisible = this.match(this.getRouteLabel(classification));
      const labelVisible = this.match(this.label);

      this._lastSearch = str;
      this._isVisible = (meVisible || typeVisible || labelVisible);
      return this._isVisible;
    }
    return true;
  }

  get sourceDocumentation(): string { return this.getDocumentation('source'); }
  get targetDocumentation(): string { return this.getDocumentation('target'); }
  private getDocumentation(from) {
    return this.extension[from][0].documentation[0].value || '';
  }

  _sourceHeaderClean: string;
  _targetHeaderClean: string;
  get sourceDocumentationHeader(): string { return this.getDocHeader('source'); }
  get targetDocumentationHeader(): string { return this.getDocHeader('target'); }
  private getDocHeader(from) {
    if (!this[`_${from}HeaderClean`]) {
      const doc = this.getDocumentation(from);
      this[`_${from}HeaderClean`] = doc.indexOf('\n') > 0 ? doc.substr(0, doc.indexOf('\n')) : doc;
    }
    return this[`_${from}HeaderClean`];
  }

  _sourceDocBody: string;
  _targetDocBody: string;
  get sourceDocumentationBody(): string { return this.getDocBody('source'); }
  get targetDocumentationBody(): string { return this.getDocBody('target'); }
  private getDocBody(from) {
    if (!this[`_${from}DocBody`]) {
      const doc = this.getDocumentation(from);
      this[`_${from}DocBody`] = Association.markPipe.transform(doc.indexOf('\n') > 0 ? doc.substr(doc.indexOf('\n') + 1) : '');
    }
    return this[`_${from}DocBody`];
  }

  constructor() {
    super();
  }

  getDocumentationHeader(clas: Classification): string {
    return this.start === clas.xmiId ? this.targetDocumentationHeader : this.sourceDocumentationHeader;
  }

  getDocumentationBody(clas: Classification): string {
    return this.start === clas.xmiId ? this.targetDocumentationBody : this.sourceDocumentationBody;
  }

  getRouteTo(clas: Classification) {
    return this.start === clas.xmiId ? this.extension.target[0].reference.id : this.extension.source[0].reference.id;
  }
  getRouteLabel(clas: Classification) {
    return this.start === clas.xmiId ? this.extension.target[0].reference.name : this.extension.source[0].reference.name
  }
}
