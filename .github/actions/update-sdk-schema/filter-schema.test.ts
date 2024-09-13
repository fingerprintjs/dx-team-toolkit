import {filterSchema} from "./filter-schema";
import {loadScopes} from "./scopes";

const scopes = loadScopes(`
events:
  path: /events/{request_id}
  methods:
    - get
    - put
visitors:
  path: /visitors/{visitor_id}
  methods:
    - get
    - delete
webhook:
  path: /webhook
  methods:
    - trace
related-visitors:
  path: /related-visitors
  methods:
    - get
`)

const schemaWithVisits =
`openapi: 3.0.0
info:
  title: Test,
  version: 1.0.0
paths:
  /visitors/{visitor_id}:
    get:
      parameters:
        - name: visitor_id
          in: path
          required: true
          schema:
            type: string
          example: mcEozNgqhKgmfXx7ZaMW
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Response'
components:
  schemas:
    Response:
      type: object
      additionalProperties: false
      properties:
        visitorId:
          type: string
      required:
        - visitorId
        - visits
      title: Response
`;

const schemaWithRelatedVisitors =
`openapi: 3.0.0
info:
  title: Test,
  version: 1.0.0
paths:
  /visitors/{visitor_id}:
    get:
      parameters:
        - name: visitor_id
          in: path
          required: true
          schema:
            type: string
          example: mcEozNgqhKgmfXx7ZaMW
      responses:
        '200':
          description: Auto generated using Swagger Inspector
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Response'

  /related-visitors:
    get:
      tags:
        - Related Visitors
      operationId: getRelatedVisitors
      parameters:
        - name: visitor_id
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RelatedVisitorsResponse'
components:
  schemas:
    Response:
      type: object
      additionalProperties: false
      properties:
        visitorId:
          type: string
      required:
        - visitorId
        - visits
      title: Response
    RelatedVisitorsResponse:
      type: object
      additionalProperties: false
      properties:
        relatedVisitors:
          type: array
          items:
            $ref: '#/components/schemas/RelatedVisitor'
      required:
        - relatedVisitors
`;
describe('filterSchema', () => {
    it('do nothing', () => {
        const result = filterSchema(schemaWithVisits, scopes, ['visitors', 'events'])
        expect(result).toBe(schemaWithVisits)
    })

    it('remove relatedVisitors', () => {
        const result = filterSchema(schemaWithRelatedVisitors, scopes, ['visitors', 'events', 'webhook'])
        expect(result).toBe(schemaWithVisits)
    })
});
