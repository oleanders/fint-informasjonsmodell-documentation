import { EABaseClass } from './EABaseClass';

export class Connection extends EABaseClass {
  aggregation: string;
  isOrdered: boolean;
  targetScope: string;
  changeable: string;
  type: string;

  constructor(json: any) {
    super(json);
    this.aggregation = json['_aggregation'];
    this.isOrdered = json['_isOrdered'];
    this.targetScope = json['_targetScope'];
    this.changeable = json['_changeable'];
    this.type = json['_type'];
  }
}
