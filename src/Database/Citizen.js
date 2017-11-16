import ClassRegistry from './ClassRegistry';

const Citizen = function (args) {
    let _args = args || {};
    this._firstName = _args.firstName || "unset";
    this._lastName = _args.lastName || "unset";
    this._email = _args.email || 0;
};

ClassRegistry.register({
    name: "Citizen",
    props: [
        { firstName: "string" },
        { lastName: "number" },
        { email: "string" },
        { address: "Address"}
    ]
});


Citizen.prototype = {
    get firstName() { return this.firstName },
    set firstName(firstName) { this.firstName = firstName; },
    get lastName() { return this.lastName },
    set lastName(lastName) { this.lastName = lastName; },
    get email() { return this.email },
    set email(email) { this.email = email; },

    load: function (locker) {
        this._firstName = locker.read("firstName");
        this._lastName = locker.read("lastName");
        this._email = locker.read("email");
    },
    save: function (locker) {
        locker.write("firstName", this._firstName);
        locker.write("lastName", this._lastName);
        locker.write("email", this._email);
    },
};

export default Citizen;

// crofrenepi@ibsats.com
// https://www.goldhawkinteractive.com/forums/index.php
// moulinrouge:zunami0505
// www.yopmail.com/en/