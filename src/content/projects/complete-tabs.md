---
title: Complete Tabs
github: https://github.com/bk7987/complete-tabs
description: Construction project data API and dashboard client.
previewImg: /img/tabs-screenshot.png
tags:
  - TypeScript
  - Express
  - Docker
  - Firebase
  - PostgreSQL
  - Jest
  - React
  - Formik
  - TailwindCSS
  - ReactRouter
  - FramerMotion
weight: 1
---

# Complete Tabs

<a href="https://travis-ci.com/github/bk7987/complete-tabs"><img src="https://travis-ci.com/bk7987/complete-tabs.svg?branch=master" /></a>
<a href="https://codecov.io/gh/bk7987/complete-tabs">
<img src="https://codecov.io/gh/bk7987/complete-tabs/branch/master/graph/badge.svg?token=PASPRA7MK5"/>
</a>

Complete Tabs is a construction project data API and client. It was created to allow construction companies to upload contract and plan data to a central location and allow detailed analysis of the data via sorting, filtering, and searching.

## **The API**

The Complete Tabs API follows basic REST principles and communicates with users via JSON payloads and responses. It authenticates users via JWT access credentials and uses standard HTTP response codes.

Prepend all routes with `/api/v1`, using the appropriate version of the API you wish to consume.

### **Getting Started**

Coming soon...

### **Versioning**

The current version of the Complete Tabs API is v1. All v1 routes are accessible via `/api/v1`.

### **Required Headers**

To access any route (other than authentication routes), the user must send requests with the `Authentication` header set to `Bearer <token>` where `<token>` is a valid authentication token issued by the API, as described in the [Authentication](#authentication) section.

### **Authentication**

You may register with the API via a POST request to the `/auth/register` endpoint. The required payload for registration is as follows:

| Parameter | Type   | Required | Description                                              |
| :-------- | :----- | :------- | :------------------------------------------------------- |
| email     | string | yes      | Email you wish to register under. Must be a valid email. |
| password  | string | yes      | Password for authenticating with the API and web client. |

Example:

```json
{
	"email": "example@example.com",
	"password": "password123"
}
```

### **Core Resources**

The API is organized around seven core resources:

1. [Organizations](#the-organization-object)
2. [Projects](#the-project-object)
3. [ContractItems](#the-contractitem-object)
4. [Estimates](#the-estimate-object)
5. [TabItems](#the-tabitem-object)
6. [EstimateItems](#the-estimateitem-object)
7. [CostCodes](#the-costcode-object)

### **The Organization Object**

Organizations represent individual entities that can own projects and all of the resources under that. Each member of an Organization has full access to all of the resources created under that organization. A user may only belong to one Organization at a time.

#### **Endpoints**

| Method | Route                 |
| :----- | :-------------------- |
| GET    | /api/v1/organizations |
| POST   | /api/v1/organizations |

| Parameter | Type   | Required | Description                               |
| :-------- | :----- | :------- | :---------------------------------------- |
| name      | string | yes      | Name of the organization. Must be unique. |

Example (POST /api/v1/organizations):

```json
{
	"name": "My Organization"
}
```

Response:

```json
{
	"object": "organization",
	"id": "fc267cad-022c-4476-93b5-b22bf8852715",
	"name": "My Organization",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

The GET `/api/v1/organizations` endpoint returns the user's current organization in the same form as above.

### **The Project Object**

Project are organize sets of the other resources into separate entities, so that different projects can be tracked separately. A project has a number of "metadata" fields that will allow the user to input important parts of information about that project.

#### **Endpoints**

| Method | Route                               |
| :----- | :---------------------------------- |
| GET    | /api/v1/projects                    |
| GET    | /api/v1/projects/:id                |
| POST   | /api/v1/projects                    |
| PUT    | /api/v1/projects/:id                |
| DELETE | /api/v1/projects/:id                |
| GET    | /api/v1/projects/:id/contract-items |
| POST   | /api/v1/projects/:id/contract-items |

Example (POST /api/v1/projects):

```json
{
	"name": "My Project",
	"projectNumber": "202101",
	"description": "My first project!",
	"client": "My Client",
	"active": true
}
```

Response:

```json
{
	"object": "project",
	"id": "fc267cad-022c-4476-93b5-b22bf8852715",
	"name": "My Project",
	"description": "My first project!",
	"client": "My Client",
	"active": true,
	"organization": "3d8c7236-040f-4531-ae99-8a4f3beb1305",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

### **The ContractItem Object**

ContractItems represent individual pieces of work in the contract and contain a quantity and unit price, among other attributes. A Project consists of many ContractItems, while a ContractItem belongs to only one Project. In order to create a ContractItem, you must provide the Project id, or create it via the `/api/v1/projects/:id/contract-items` endpoint. Note that all price fields should be in cents, so an intended value of `$1.00` would be represented in cents as `100`.

#### **Endpoints**

| Method | Route                                     |
| :----- | :---------------------------------------- |
| GET    | /api/v1/contract-items                    |
| GET    | /api/v1/contract-items/:id                |
| POST   | /api/v1/contract-items                    |
| PUT    | /api/v1/contract-items/:id                |
| DELETE | /api/v1/contract-items/:id                |
| GET    | /api/v1/contract-items/:id/estimate-items |
| POST   | /api/v1/contract-items/:id/estimate-items |
| GET    | /api/v1/contract-items/:id/tab-items      |
| POST   | /api/v1/contract-items/:id/tab-items      |
| GET    | /api/v1/contract-items/:id/cost-codes     |
| POST   | /api/v1/contract-items/:id/cost-codes     |

Example (POST /api/v1/contract-items):

```json
{
	"itemNumber": "9999-9999",
	"description": "My first contract-item!",
	"quantity": 1.5,
	"unit": "LF",
	"unitPrice": 500,
	"projectId": "fc267cad-022c-4476-93b5-b22bf8852715"
}
```

Response:

```json
{
	"object": "contract-item",
	"id": "dfa1c961-0a46-4966-9a20-33605e67daa1",
	"description": "My first contract-item!",
	"quantity": 1.5,
	"unit": "LF",
	"unitPrice": 500,
	"project": "fc267cad-022c-4476-93b5-b22bf8852715",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

### **The Estimate Object**

Estimates represents a payment from the client. Estimates contain many EstimateItems, which are the individual line items that comprise the Estimate. Estimates have a unique number and a period ending date.

#### **Endpoints**

| Method | Route                                |
| :----- | :----------------------------------- |
| GET    | /api/v1/estimates                    |
| GET    | /api/v1/estimates/:id                |
| POST   | /api/v1/estimates                    |
| PUT    | /api/v1/estimates/:id                |
| DELETE | /api/v1/estimates/:id                |
| GET    | /api/v1/estimates/:id/estimate-items |
| POST   | /api/v1/estimates/:id/estimate-items |

Example (POST /api/v1/estimates):

```json
{
	"estimateNumber": "1",
	"periodEnding": "2021-01-15",
	"projectId": "fc267cad-022c-4476-93b5-b22bf8852715"
}
```

Response:

```json
{
	"object": "estimate",
	"id": "7d249963-7c07-4c38-b918-3af51cbb9497",
	"periodEnding": "2021-01-15",
	"project": "fc267cad-022c-4476-93b5-b22bf8852715",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

### **The TabItem Object**

TabItems are individual pieces of work that have a location and quantity. Each TabItem belongs to a ContractItem. TabItems are not unique in any way and many TabItems can belong to a single ContractItem. The beginStation and endStation attributes are in tenths of a foot.

#### **Endpoints**

| Method | Route                 |
| :----- | :-------------------- |
| GET    | /api/v1/tab-items     |
| GET    | /api/v1/tab-items/:id |
| POST   | /api/v1/tab-items     |
| PUT    | /api/v1/tab-items/:id |
| DELETE | /api/v1/tab-items/:id |

Example (POST /api/v1/tab-items):

```json
{
	"tabSet": "Roadway",
	"quantity": 100.5,
	"remarks": "Parking Lot 1",
	"street": "Main St",
	"side": "LT",
	"beginStation": 1000000,
	"endStation": 1500000,
	"contractItemId": "dfa1c961-0a46-4966-9a20-33605e67daa1"
}
```

Response:

```json
{
	"object": "tab-item",
	"id": "cda3475c-1dd2-4ffe-a82c-a0d15a23911d",
	"tabSet": "Roadway",
	"quantity": 100.5,
	"remarks": "Parking Lot 1",
	"street": "Main St",
	"side": "LT",
	"beginStation": 1000000,
	"endStation": 1500000,
	"contractItem": "dfa1c961-0a46-4966-9a20-33605e67daa1",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

### **The EstimateItem Object**

EstimateItems are what represent the individual line items of an estimate. They have specific quantities and their unit price is derived from a ContractItem. Therefore, they belong to one Estimate and one ContractItem.

#### **Endpoints**

| Method | Route                      |
| :----- | :------------------------- |
| GET    | /api/v1/estimate-items     |
| GET    | /api/v1/estimate-items/:id |
| POST   | /api/v1/estimate-items     |
| PUT    | /api/v1/estimate-items/:id |
| DELETE | /api/v1/estimate-items/:id |

Example (POST /api/v1/estimate-items):

```json
{
	"quantity": 11.5,
	"contractItemId": "dfa1c961-0a46-4966-9a20-33605e67daa1",
	"estimateId": "7d249963-7c07-4c38-b918-3af51cbb9497"
}
```

Response:

```json
{
	"object": "estimate-item",
	"id": "ecd717f1-0ced-4d57-8b5f-c731cc3a15a5",
	"quantity": 11.5,
	"contractItem": "dfa1c961-0a46-4966-9a20-33605e67daa1",
	"estimate": "7d249963-7c07-4c38-b918-3af51cbb9497",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

### **The CostCode Object**

CostCodes belong to ContractItems and contain company cost information associated with the piece of work defined by the ContractItem. CostCodes should be unique within the Project that they are created. CostCodes must be created with a reference to a ContractItem. Again, since laborBudget and equipmentBudget are currency amounts, they should be in cents.

#### **Endpoints**

| Method | Route                  |
| :----- | :--------------------- |
| GET    | /api/v1/cost-codes     |
| GET    | /api/v1/cost-codes/:id |
| POST   | /api/v1/cost-codes     |
| PUT    | /api/v1/cost-codes/:id |
| DELETE | /api/v1/cost-codes/:id |

Example (POST /api/v1/cost-codes):

```json
{
	"code": "11111-11111",
	"description": "Subbase Material",
	"quantity": 4500,
	"unit": "TON",
	"laborHours": 35.5,
	"equipmentHours": 35.5,
	"laborBudget": 340000,
	"equipmentBudget": 150000,
	"contractItemId": "dfa1c961-0a46-4966-9a20-33605e67daa1"
}
```

Response:

```json
{
	"object": "cost-code",
	"id": "9fcd3442-7282-4cdf-a561-55d8f93ba006",
	"quantity": 4500,
	"unit": "TON",
	"laborHours": 35.5,
	"equipmentHours": 35.5,
	"laborBudget": 340000,
	"equipmentBudget": 150000,
	"contractItem": "dfa1c961-0a46-4966-9a20-33605e67daa1",
	"createdAt": 1610731140,
	"updatedAt": 1610731140
}
```

## **The Client**

The web client has not yet been created. Check back for updates.
