const AWS = require("aws-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "products";

const getProduct = async () => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    const products = await dynamoClient.scan(params).promise();
    console.log(products);
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("There is no product at the moment");
  }
};

const addProduct = async (product) => {
  try {
    const productId = uuidv4();
  // id ile birlikte ürün oluşturma
    const productWithId = {
      ...product,
      id: productId
    };

    const params = {
      TableName: TABLE_NAME,
      Item: productWithId
    };

    return await dynamoClient.put(params).promise();
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding the product. Please try again later.");
  }
};

const getProductById = async (id) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };
    return await dynamoClient.get(params).promise();
  } catch (error) {
    console.error(error);
    throw new Error("Product not found");
  }
};

const deleteProduct = async (id) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };
    return await dynamoClient.delete(params).promise();
  } catch (error) {
    console.error(error);
    throw new Error("Product not found");
  }
};

module.exports = {
  deleteProduct,
  getProductById,
  addProduct,
  getProduct
};
