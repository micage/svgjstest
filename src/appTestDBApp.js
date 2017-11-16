import Adress from './DataBase/Address';
import DB from './DataBase/FakeDB';

let addresses = [];

addresses.push(
    new Adress({
        street: "Bornholmer Str.",
        house: 79,
        city: "Berlin",
        postal: 10439
    })
);
addresses.push(
    new Adress({
        street: "Paul-Robeson-Str.",
        house: 19,
        city: "Berlin",
        postal: 10439
    })
);


console.log(addresses);
// at this point db knows nothing about adresses, so this can not work
// adress.save(db);

if (module.hot) {
    module.hot.accept();
}