{
  "paging_metadata": {},
  "result": [
  {
    "keys": [
      {
        "type": "Submodel",
        "value": "https://example.com/ids/sm/2155_5103_1132_3585"
      }
    ],
    "type": "ExternalReference"
  },
  {
    "keys": [
      {
        "type": "Submodel",
        "value": "https://example.com/ids/sm/4552_5192_1132_6712"
      }
    ],
    "type": "ExternalReference"
  },
  {
    "keys": [
      {
        "type": "Submodel",
        "value": "https://example.com/ids/sm/7380_6182_1132_6328"
      }
    ],
    "type": "ExternalReference"
  },
  {
    "keys": [
      {
        "type": "Submodel",
        "value": "https://example.com/ids/sm/7385_5182_1132_4905"
      }
    ],
    "type": "ExternalReference"
  }
]
}


const mock{
  "paging_metadata": {},
  "result": [
  {
    "modelType": "SubmodelElementCollection",
    "idShort": "OilTemperatureOperationalLimit",
    "value": [
      {
        "modelType": "Property",
        "value": "RTE",
        "valueType": "xs:string",
        "idShort": "dataProvider"
      },
      {
        "modelType": "SubmodelElementCollection",
        "idShort": "OperationalLimitSet",
        "value": [
          {
            "modelType": "Property",
            "value": "75",
            "valueType": "xs:integer",
            "idShort": "OperationalLimitValue"
          },
          {
            "modelType": "Property",
            "value": "OilTemperatureOperationalLimitSet",
            "valueType": "xs:string",
            "idShort": "name"
          },
          {
            "modelType": "Property",
            "valueType": "xs:dateTime",
            "idShort": "dateModified"
          }
        ],
        "description": [
          {
            "language": "en",
            "text": "A set of limits associated with equipment. Sets of limits might apply to a specific temperature, or season for example. A set of limits may contain different severities of limit levels that would apply to the same equipment. The set may contain limits of different types such as apparent power and current limits or high and low voltage limits that are logically applied together as a set."
          }
        ]
      },
      {
        "modelType": "SubmodelElementCollection",
        "idShort": "OperationalLimitType",
        "value": [
          {
            "modelType": "Property",
            "value": "OilTemperatureOperationalLimitType",
            "valueType": "xs:string",
            "idShort": "name"
          },
          {
            "modelType": "SubmodelElementCollection",
            "idShort": "Percent",
            "value": [
              {
                "modelType": "Property",
                "value": "20",
                "valueType": "xs:integer",
                "idShort": "value"
              }
            ]
          },
          {
            "modelType": "SubmodelElementCollection",
            "idShort": "OverexcLimX1",
            "value": [
              {
                "modelType": "Property",
                "value": "1.2",
                "valueType": "xs:double",
                "idShort": "kmx"
              },
              {
                "modelType": "Property",
                "value": "20",
                "valueType": "xs:integer",
                "idShort": "t1"
              },
              {
                "modelType": "Property",
                "value": "5",
                "valueType": "xs:integer",
                "idShort": "t2"
              }
            ]
          }
        ]
      }
    ]
  }
]
}