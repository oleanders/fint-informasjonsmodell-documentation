import { Collaboration } from './Collaboration';
import { Package } from './Package';
import { Classification } from './Classification';
import { EABaseClass } from './EABaseClass';

/**
 * Top node of the EA xml tree
 */
export class Model extends EABaseClass {
  classification: Classification;
  collaboration: Collaboration;
  package: Package;

  constructor(json: {}, parent: EABaseClass) {
    super(json, parent);
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Class) {
      this.classification = new Classification(json['Namespace.ownedElement'].Class, this);
    }
    if (json['Namespace.ownedElement'] && json['Namespace.ownedElement'].Package) {
      let mainPackage = json['Namespace.ownedElement'].Package;
      if (mainPackage['ModelElement.taggedValue']) {
        this.meta = EABaseClass.toMeta(mainPackage['ModelElement.taggedValue'].TaggedValue);
      }
      if (mainPackage['Namespace.ownedElement'] && mainPackage['Namespace.ownedElement'].Collaboration) {
        this.collaboration = new Collaboration(mainPackage['Namespace.ownedElement'].Collaboration, this);
      }
      this.package = new Package(mainPackage['Namespace.ownedElement'].Package, this);
    }
  }

  filter(search: string) {
    this.package = this.package.filter(search, true);
    return this;
  }
}
