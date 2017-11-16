
import ClassRegistry from './ClassRegistry';

const Address = function (args) {
    let _args = args || {};
    this._street = _args.street || "unset";
    this._house = _args.house || 0;
    this._city = _args.city || "unset";
    this._postal = _args.postal || 0;

    //this._locker = db.createLocker();
};

ClassRegistry.register({
    name: "Address",
    props: [
        { name: "street", type: "string" },
        { name: "house", type: "number" },
        { name: "city", type: "string" },
        { name: "postal", type: "number" },
    ]
});


Address.prototype = {
    get street() { return this._street; },
    set street(street) { this._street = street; },
    get house() { return this._house; },
    set house(house) { this._house = house; },
    get city() { return this._city; },
    set city(city) { this._city = city; },
    get postal() { return this._postal; },
    set postal(postal) { this._postal = postal; },

    load: function (locker) {
        locker.write(this._street);
        locker.write(this._house);
        locker.write(this._city);
        locker.write(this._postal);
    },
    save: function (locker) {
        locker.load(this._street);
        locker.load(this._house);
        locker.load(this._city);
        locker.load(this._postal);
    },
};

export default Address;

// crofrenepi@ibsats.com
// https://www.goldhawkinteractive.com/forums/index.php
// moulinrouge:zunami0505
// www.yopmail.com/en/

