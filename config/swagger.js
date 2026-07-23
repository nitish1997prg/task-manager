import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description:
                "A RESTful Task Manager API built with Express, MongoDB, JWT Authentication, Zod validation, Docker and deployed on Google Cloud Run.",
            contact: {
                name: "Nitish Viraktamath"
            }
        },

        servers: [
            {
                url: "http://localhost:3001",
                description: "Local Development"
            },
            {
                url: "https://task-manager-501138420037.asia-south1.run.app",
                description: "Production"
            }
        ],

        tags: [
            {
                name: "Users",
                description: "Authentication endpoints"
            },
            {
                name: "Tasks",
                description: "Task management endpoints"
            }
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
            }
        },

        schemas: {

        RegisterRequest: {
            type: "object",
            required: ["name", "email", "password"],

            properties: {
                name: {
                    type: "string",
                    example: "Nitish"
                },

                email: {
                    type: "string",
                    format: "email",
                    example: "nitish@gmail.com"
                },

                password: {
                    type: "string",
                    example: "Herzleid123"
                }
            }
        },
        SuccessMessage: {
            type: "object",
            properties: {
            message: {
                type: "string",
                example: "Operation completed successfully."
            }
            }
        },
        ErrorResponse: {
            type: "object",
            properties: {
            message: {
                type: "string",
                example: "An error occurred."
            }
            }
        },
        RegisterResponse: {
            type: "object",
            properties: {
            message: {
                type: "string",
                example: "User registered successfully!"
            },
            insertedUserId: {
                type: "string",
                example: "669b76d6c3f3a8b4c5e712a9"
            }
        }
        },
        LoginRequest: {
            type: "object",
            required: ["email", "password"],

            properties: {
            email: {
                type: "string",
                format: "email",
                example: "nitish@gmail.com"
            },

            password: {
                type: "string",
                example: "Herzleid123"
            }
            }
        },
        LoginResponse: {
            type: "object",

            properties: {
            message: {
                type: "string",
                example: "User logged in successfully!"
            },

            token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
        },
        CreateTaskRequest: {
        type: "object",

        required: ["title"],

        properties: {
            title: {
                type: "string",
                example: "Learn OpenAPI"
            },

        description: {
            type: "string",
            example: "Document my backend project."
        }
        }
        },
        CreateTaskResponse: {
        type: "object",

        properties: {
            insertedId: {
                type: "string",
                example: "669b76d6c3f3a8b4c5e712a9"
            },

        message: {
            type: "string",
            example: "Task inserted successfully"
                }
            }
        },
        Task: {
        type: "object",

        properties: {
        _id: {
            type: "string",
            example: "669b76d6c3f3a8b4c5e712a9"
        },

        title: {
            type: "string",
            example: "Learn OpenAPI"
        },

        description: {
            type: "string",
            example: "Document my backend."
        },

        completed: {
            type: "boolean",
            example: false
        },

        userId: {
            type: "string",
            example: "669b76d6c3f3a8b4c5e712a9"
        }
    }
        },
        UpdateTaskRequest: {
        type: "object",
        properties: {
            title: {
                type: "string",
                example: "Learn OpenAPI"
            },

        description: {
            type: "string",
            example: "Document my backend project."
        },
        completed: {
            type: "boolean",
            example: true
        }
        }
        },

        DeleteTaskResponse: {
            type: "object",
            properties: {
            message: {
                type: "string",
                example: "Task deleted successfully!"
            },
        }
        },
        }
    }
    },

    apis: [
        "./routes/*.js"
    ]
};

export default swaggerJsdoc(options);