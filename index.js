'use strict';

const PICK_ALL = 1;

function pickMerge(source, patch) {
  if (isLeafSchema(source)) {
    return Object.assign(source, patch);
  }
  if (isArraySchema(source)) {
    let new_items_schema;

    if (patch.items) {
      if (Array.isArray(source.items)) {
        new_items_schema = [];
        for (let i in source.items) {
          new_items_schema.push(pickMerge(source.items[i], patch.items[i]));
        }
        patch.items = new_items_schema;
      }
      else if (isObjectSchema(source.items)) {
        new_items_schema = pickMerge(source.items, patch.items);
      }
    }

    return Object.assign(source, patch, { items : new_items_schema });
  }
  if (isObjectSchema(source)) {
    let new_properties_schema;

    if (patch.properties) {
      new_properties_schema = {};

      if (source.properties) {
        for (let property in patch.properties) {
          let patch_property_schema = patch.properties[property];
          let source_property_schema = source.properties[property];

          if (source_property_schema === undefined) {
            source_property_schema = {};
          }
          if (patch_property_schema === PICK_ALL) {
            patch_property_schema = {};
          }

          new_properties_schema[property] = pickMerge(source_property_schema, patch_property_schema);
        }
      }
    }

    return Object.assign(source, patch, { properties : new_properties_schema });
  }

  return patch;
}

function isObject(val) {
  return val !== undefined && val !== null && typeof val === 'object';
}

function isLeafSchema(schema) {
  return isObject(schema) && !['array', 'object'].includes(schema.type) && !isObject(schema.properties);
}

function isArraySchema(schema) {
  return isObject(schema) && schema.type === 'array';
}

function isObjectSchema(schema) {
  return isObject(schema) && (schema.type === 'object' || isObject(schema.properties));
}

module.exports = pickMerge;