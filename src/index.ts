export class tsMap<K,V> {

    public length:Number;

    /**
     * Used to hold any array of the map items.
     * 
     * @internal
     * @type {(Array<Array<K|V>>)}
     * @memberOf tsMap
     */
    private _items:Array<Array<K|V>>;

    /**
     * Used to hold an array of keys in the map
     * 
     * @internal
     * @type {Array<K>}
     * @memberOf tsMap
     */
    private _keys:Array<K>;

    /**
     * Used to hold an array of values in the map
     * 
     * @internal
     * @type {Array<V>}
     * @memberOf tsMap
     */
    private _values:Array<V>;

    constructor(inputMap?:Array<Array<K|V>>) {
        let t = this;

        t._items = [];
        t._keys = [];
        t._values = [];
        t.length = 0;

        if(inputMap) {
            inputMap.forEach((v,k) => {
                t.set(v[0],v[1]);
            });
        }
    }

    /**
     * Converts a JSON object to an map.
     * 
     * @param {*} jsonObject
     * 
     * @memberOf tsMap
     */
    public fromJSON(jsonObject:any) {
        for (let property in jsonObject) {  
            if (jsonObject.hasOwnProperty(property)) {
                this.set(<any> property, jsonObject[property]);
            }
        }        
    }

    /**
     * Outputs the contents of the map to a JSON object
     * 
     * @returns {*}
     * 
     * @memberOf tsMap
     */
    public toJSON():any {
        let obj = {};
        let t = this;
        t.keys().forEach((k) => {
            obj[String(k)] = t.get(k);
        });
        return obj;
    }

    /**
     * Get an array of arrays respresenting the map, kind of like an export function.
     * 
     * @returns {(Array<Array<K|V>>)}
     * 
     * @memberOf tsMap
     */
    public entries():Array<Array<K|V>> {
        return [].slice.call(this._items);
    }

    /**
     * Get an array of keys in the map.
     * 
     * @returns {Array<K>}
     * 
     * @memberOf tsMap
     */
    public keys():Array<K> {
        return [].slice.call(this._keys);
    }

    /**
     * Get an array of the values in the map.
     * 
     * @returns {Array<V>}
     * 
     * @memberOf tsMap
     */
    public values():Array<V> {
        return [].slice.call(this._values);
    }

    /**
     * Check to see if an item in the map exists given it's key.
     * 
     * @param {K} key
     * @returns {Boolean}
     * 
     * @memberOf tsMap
     */
    public has(key:K):Boolean {
        return this._keys.indexOf(key) > -1;
    }

    /**
     * Get a specific item from the map given it's key.
     * 
     * @param {K} key
     * @returns {V}
     * 
     * @memberOf tsMap
     */
    public get(key:K):V {
        let i = this._keys.indexOf(key);
        return i > -1 ? this._values[i] : undefined;        
    }

    /**
     * Set a specific item in the map given it's key, automatically adds new items as needed. 
     * Ovewrrites existing items
     * 
     * @param {K} key
     * @param {V} value
     * 
     * @memberOf tsMap
     */
    public set(key:K, value:V):void {
        let t = this;
        // check if key exists and overwrite
        let i = this._keys.indexOf(key);
        if (i > -1) {
            t._items[i][1] = value;
            t._values[i] = value;
        } else {
            t._items.push([key, value]);
            t._keys.push(key);
            t._values.push(value);
        }
        t.length = t.size();
    }

    /**
     * Provide a number representing the number of items in the map
     * 
     * @returns {Number}
     * 
     * @memberOf tsMap
     */
    public size():Number {
        return this._items.length;
    }

    /**
     * Clear all the contents of the map
     * 
     * @memberOf tsMap
     */
    public clear():void {
        let t = this;
        t._keys.length = t._values.length = t._items.length = 0;
        t.length = t.size();
    }

    /**
     * Delete an item from the map given it's key
     * 
     * @param {K} key
     * @returns {Boolean}
     * 
     * @memberOf tsMap
     */
    public delete(key:K):Boolean {
        let t = this;
        let i = t._keys.indexOf(key);
        if (i > -1) {
            t._keys.splice(i, 1);
            t._values.splice(i, 1);
            t._items.splice(i, 1);
            t.length = t.size();
            return true;
        }
        return false;
    }

    /**
     * Used to loop through the map.  
     * 
     * @param {(value:V,key?:K,map?:tsMap<K,V>) => void} callbackfn
     * 
     * @memberOf tsMap
     */
    public forEach(callbackfn:(value:V,key?:K) => void):void {
        let t = this;
        t._keys.forEach((v) => {
            callbackfn(t.get(v),v);
        });
    }

    /**
     * Returns an array containing the returned value of each item in the map.
     * 
     * @param {(value:V,key?:K) => void} callbackfn
     * @returns {*}
     * 
     * @memberOf tsMap
     */
    public map(callbackfn:(value:V,key?:K) => any):Array<any> {
        let t = this;
        return this._keys.map((itemKey) =>{
            return callbackfn(t.get(itemKey),itemKey);
        });
    }

    /**
     * Removes items based on a conditional function passed to filter
     * 
     * @param {(value:V,key?:K) => Boolean} callbackfn
     * @returns {tsMap<K,V>}
     * 
     * @memberOf tsMap
     */
    public filter(callbackfn:(value:V,key?:K) => Boolean):tsMap<K,V> {
        let t = this;
        t._keys.forEach((v) => {
            if(callbackfn(t.get(v),v) == false) t.delete(v); 
        });
        return this;
    }

    /**
     * Creates a deep copy of the map, breaking all references to the old map and it's children.
     * Uses JSON.parse so any functions will be stringified and lose their original purpose.
     * 
     * @returns {tsMap<K,V>}
     * 
     * @memberOf tsMap
     */
    public clone():tsMap<K,V> {
        return new tsMap<K,V>(<any> JSON.parse(JSON.stringify(this._items)));
    }
}