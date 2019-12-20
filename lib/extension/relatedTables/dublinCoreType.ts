/**
 * @module  extension/relatedTables
 */

/**
 * Dublin Core Metadata Initiative term types
 * @class
 */
export class DublinCoreType {

  /**
   * A point or period of time associated with an event in the lifecycle of
   * the resource.
   * @type {Object}
   */
  public static readonly DATE: DublinCoreType = new DublinCoreType('date');

  /**
   * An account of the resource.
   * @type {Object}
   */
  public static readonly DESCRIPTION: DublinCoreType = new DublinCoreType('description');

  /**
   * The file format, physical medium, or dimensions of the resource.
   * @type {Object}
   */
  public static readonly FORMAT: DublinCoreType = new DublinCoreType('format', ['content_type']);

  /**
   * An unambiguous reference to the resource within a given context.
   * @type {Object}
   */
  public static readonly IDENTIFIER: DublinCoreType = new DublinCoreType('identifier', ['id']);

  /**
   * A related resource from which the described resource is derived.
   * @type {Object}
   */
  public static readonly SOURCE: DublinCoreType = new DublinCoreType('source');

  /**
   * A name given to the resource.
   * @type {Object}
   */
  public static readonly TITLE: DublinCoreType = new DublinCoreType('title');

  constructor(public name: string, public synonyms?: string[]) {
  }

  /**
   * Get the Dublin Core Type from the name
   * @param  {string} name name
   * @return {module:extension/relatedTables~DublinCoreType}
   */
  public static fromName(name: string): DublinCoreType {
    for (var prop in DublinCoreType) {
      var type = DublinCoreType[prop];
      if (type.name === name) {
        return type;
      }
    }
    for (var prop in DublinCoreType) {
      var type = DublinCoreType[prop];
      if (type.synonyms) {
        for (var i = 0; i < type.synonyms.length; i++) {
          if (type.synonyms[i] === name) {
            return type;
          }
        }
      }
    }
  }
}