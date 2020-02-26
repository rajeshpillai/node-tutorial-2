// IIFE

// (function () {
//     alert('hi');
// })();


let contact = {
    name: "rajesh",
    type: "home",
    display: function (loc, food) {
      console.log(`
        Name is ${this.name} and type 
        is ${this.type}
      `);
      console.log(`Location is ${loc} and food is ${food}`)
    }
  }
  
  
  let office = {
    name: "Dassault",
    type: "IT"
  }
      
  
  console.log(contact);
  console.log(office);
  
  contact.display("pune", "vada pav");
  
  contact.display.call(office, "mumbai", "pav bhaji---");
  
  contact.display.apply(office, ["mumbai", "pav bhaji"]);
  
  let display = contact.display.bind(office, ["para 1", "para 2"]);

  display();

  
  console.log(
      Math.max.apply(null,[10,20, 5])
  );
  
  
  