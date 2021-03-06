import { transformRequestData, transformResponseData } from '../../src/helpers/data'

describe('helper:data',()=>{
    describe('transformRequestData',()=>{
        test('should transform data to string if data is a PlainObject',()=>{
            const a = { a : 1}
            expect(transformRequestData(a)).toBe('{"a":1}')
        })
        test('should do nothing if data is not a PlainObject', () => {
            const a = new URLSearchParams('a=b')
            expect(transformRequestData(a)).toBe(a)
          })
    })

    describe('transformResponseData',()=>{
        test('should transform response data to Object if data is a JSON string', () => {
            const a = '{"a": 2}'
            expect(transformResponseData(a)).toEqual({ a: 2 })
          })
      
          test('should do nothing if data is a string but not a JSON string', () => {
            const a = '{a: 2}'
            expect(transformResponseData(a)).toBe('{a: 2}')
          })
      
          test('should do nothing if data is not a string', () => {
            const a = { a: 2 }
            expect(transformResponseData(a)).toBe(a)
          })
    })
})