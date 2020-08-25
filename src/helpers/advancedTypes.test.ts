import * as typesHelper from './advancedTypes.helper'

describe('schema creator helper', () => {
    it('should find closing tag index', () => {
        expect(typesHelper.getClosingTagIndex('<asd>', 1)).toBe(4)
        expect(typesHelper.getClosingTagIndex('frozen<set<frozen<tuple<set<int>, smallint>1>2>3>',11))
            .toBe(46)
    });
    it('should remove frozen tag',()=>{
        expect(typesHelper.removeFrozen('frozen<set<frozen<tuple<set<int>, smallint>1>2>3>'))
            .toBe('set<tuple<set<int>, smallint>12>3')
    });
    it('should not change anything',()=>{
        expect(typesHelper.removeFrozen('set<int>')).toBe('set<int>')
        expect(typesHelper.removeFrozen('int')).toBe('int')
    });
    it('should return set type and body of this type', function () {
        expect(typesHelper.getType('set<map<int>>')).toEqual({
            type: 'set',
            string: 'map<int>'
        });
    });
    it('should return correct object', function () {
        const obj={
            a:null,
            b:false,
            obj:{
                height:10,
            }
        }

        expect(typesHelper.createObjectType(obj))
            .toEqual({"type":"object","properties":{"a":{"type":"null"},"b":{"type":"boolean"},"obj":{"type":"object","properties":{"height":{"type":"number"}}}}})
    });
    it('should create correct schema for simple type', function () {
        expect(typesHelper.getComplexSchema('int'))
            .toEqual({ type: 'integer', minimum: -2147483648, maximum: 2147483647 })
    });
    it('should create correct schema for complex type', function () {
        expect(typesHelper.getComplexSchema('list<set<int>>'))
            .toEqual({
                type: 'array',
                items: {
                    type: 'array',
                    uniqueItems: true,
                    items: { type: 'integer', minimum: -2147483648, maximum: 2147483647 }
                }
            })
    });
    it('should create correct schema for tuple', function () {
        expect(typesHelper.getComplexSchema('tuple<int, set<int>>'))
            .toEqual({
                type: 'array',
                items: [
                    { type: 'integer', minimum: -2147483648, maximum: 2147483647 },
                    { type: 'array', uniqueItems: true, items: { type: 'integer', minimum: -2147483648, maximum: 2147483647 } }
                ]
            })
    });
    it('should serialize basic type', function () {
        expect(typesHelper.getSchema({selectedString:{column:'{"a":10}'}, type:'text', column:'column'}))
            .toEqual({ type: 'object', properties: { a: { type: 'number' } } })
    });
    it('should understand UDT',function (){
        expect(typesHelper.getSchema({selectedString:{column:{"a":10}}, type:'frozen<custom>', column:'column'}))
            .toEqual({ type: 'object', properties: { a: { type: 'number' } } })
    })
})
