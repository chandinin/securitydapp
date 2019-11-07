pragma solidity ^0.5.0;


contract CustomerInformation {
    // Code goes here...

    uint public customerCount = 0;

     constructor() public {
        createCustomer(false, false);
      }

struct Customer {
    uint id;
    bool fullName;
    bool ssn;
  }

  mapping(uint => Customer) public customers;

  event CustomerCreated(
    uint id,
    bool fullName,
    bool ssn
  );

  function createCustomer(bool _fullName, bool _ssn) public {
    customerCount ++;
    customers[customerCount] = Customer(customerCount, _fullName, _ssn);
    emit CustomerCreated(customerCount, _fullName, _ssn);
  }
}