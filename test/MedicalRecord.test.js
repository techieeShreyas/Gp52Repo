const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecords", () => {
  let user1, medical, transactionResponse, transactionReceipt;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    user1 = accounts[1];
    const Medical = await ethers.getContractFactory("MedicalRecord");
    medical = await Medical.connect(user1).deploy();
    await medical.deployed();
  });

  describe("Deployment", () => {
    it("The contract is deployed successfully", async () => {
      expect(await medical.address).to.properAddress;
    });
  });

  describe("Add Record", () => {
    beforeEach(async () => {
      transactionResponse = await medical.connect(user1).addRecord(
        "Wastron",
        22,
        "Male",
        "B positive",
        "Dengue",
        "Dengue",
        "Dengue"
      );
      transactionReceipt = await transactionResponse.wait();
    });

    it("Emits an Add Record event", async () => {
      console.log("Transaction Receipt Events:", transactionReceipt.events);

      const event = transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalRecords__AddRecord");

      const args = event.args;
      expect(args.timestamp).to.not.equal(0);
      expect(args.name).to.equal("Wastron");
      expect(args.age).to.equal(22);
      expect(args.gender).to.equal("Male");
      expect(args.bloodType).to.equal("B positive");
      expect(args.allergies).to.equal("Dengue");
      expect(args.diagnosis).to.equal("Dengue");
      expect(args.treatment).to.equal("Dengue");
    });

    it("The getRecords function is working", async () => {
      const record = await medical.getRecord(await medical.getRecordId());
      expect(await medical.getRecordId()).to.equal(1);
      expect(record[1]).to.equal("Wastron"); // Name
    });
  });

  describe("Delete Record", () => {
    beforeEach(async () => {
      await medical.connect(user1).addRecord(
        "Wastron",
        22,
        "Male",
        "B positive",
        "Dengue",
        "Dengue",
        "Dengue"
      );
      transactionResponse = await medical.connect(user1).deleteRecord(1);
      transactionReceipt = await transactionResponse.wait();
    });

    it("Marks the record as deleted", async () => {
      expect(await medical.getDeleted(1)).to.be.true;
    });

    it("Emits a Delete Record event", async () => {
      console.log("Transaction Receipt Events:", transactionReceipt.events);

      const event = transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalRecords__DeleteRecord");

      const args = event.args;
      expect(args.name).to.equal("Wastron");
    });
  });
});
