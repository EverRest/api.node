const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

Mongoose.connect("mongodb://localhost/receipts_db");

const ReceiptModel = Mongoose.model("receipt", {
    name: String,
    description: String,
    created: Date
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/receipts", async (request, response) => {
    try {
        var receipt = new ReceiptModel(request.body);
        var result = await receipt.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/receipts", async (request, response) => {
    try {
        var result = await ReceiptModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/receipts/:id", async (request, response) => {
    try {
        var receipt = await ReceiptModel.findById(request.params.id).exec();
        response.send(receipt);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.put("/receipts/:id", async (request, response) => {
    try {
        var receipt = await ReceiptModel.findById(request.params.id).exec();
        receipt.set(request.body);
        var result = await receipt.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.delete("/receipts/:id", async (request, response) => {
    try {
        var result = await ReceiptModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(3001, () => {
    console.log("Listening at :3001...");
});