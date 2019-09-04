'use strict';

const assert = require('assert');
const pickMerge = require('.');

describe('JsonSchema', () => {

  describe('pickMerge()', () => {

    it('should work with leaf schema', () => {
      const source   = { type: 'string' };
      const patch    = { minLength: 5, maxLength: 50 };
      const expected = { type: 'string', minLength: 5, maxLength: 50 };
      const actual   = pickMerge(source, patch);
      assert.deepEqual(expected, actual);
    });

    it('should work with array schema', () => {
      const source = { type : 'array', items : { properties : {
        id       : { type : 'string'  },
        quantity : { type : 'integer' },
        price    : { type : 'number'  },
      }}};

      const patch = { minItems : 1, items : { required : ['id'], properties : {
        id    : 1,
        price : { minimum : 0  }
      }}}

      const expected = { type : 'array', minItems : 1, items : { required : ['id'], properties : {
        id    : { type : 'string'  },
        price : { type : 'number', minimum : 0   }
      }}};

      const actual = pickMerge(source, patch);

      assert.deepEqual(expected, actual);
    });

    it('should work with object schema', () => {
      const source = { properties : {
        order_id : { type : 'string' },
        items    : { type : 'array', items : { properties : {
          id       : { type : 'string'  },
          quantity : { type : 'integer' },
          price    : { type : 'number'  },
        }}}
      }};

      const patch = { required : ['order_id', 'items'], properties : {
        order_id : 1,
        items    : { minItems : 1, items : { required : ['id'], properties : {
          id    : 1,
          price : { minimum : 0  }
        }}}
      }};

      const expected = { required : ['order_id', 'items'], properties : {
        order_id : { type : 'string' },
        items    : { type : 'array', minItems : 1, items : { required : ['id'], properties : {
          id    : { type : 'string'  },
          price : { type : 'number', minimum : 0   }
        }}}
      }};

      const actual = pickMerge(source, patch);
      
      assert.deepEqual(expected, actual);
    });

  });

})
