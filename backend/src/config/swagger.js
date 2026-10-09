const swaggerUi = require("swagger-ui-express");

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Job Portal Backend",
    version: "1.0.0",
    description:
      "REST API documentation for the Job Portal Backend system featuring PostgreSQL, Redis caching, JWT Authentication, and Role-Based Access Control (Admin, Recruiter, Candidate).",
    contact: {
      name: "Job Portal Support"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server"
    }
  ],
  tags: [
    { name: "System", description: "Health check and system diagnostics" },
    { name: "Auth", description: "User registration, authentication, sessions, and current profile" },
    { name: "Candidate Profile", description: "Candidate resume management and profile operations" },
    { name: "Company", description: "Recruiter company profile and logo operations" },
    { name: "Jobs", description: "Job postings, searching, filtering, and Redis-cached queries" },
    { name: "Applications", description: "Job applications submission and tracking" },
    { name: "Admin", description: "Administrative user moderation and platform oversight" }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from `/api/auth/login` or `/api/auth/register`"
      },
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "JWT token stored in httpOnly cookie"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "siddharth" },
          email: { type: "string", format: "email", example: "siddharth123@example.com" },
          role: { type: "string", enum: ["candidate", "recruiter", "admin"], example: "candidate" },
          is_blocked: { type: "boolean", example: false },
          created_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
        }
      },
      CandidateProfile: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 2 },
          phone: { type: "string", example: "9245432321" },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["Node.js", "Express", "PostgreSQL", "Redis"]
          },
          education: { type: "string", example: "B.Tech Computer Science" },
          experience: { type: "integer", example: 3 },
          location: { type: "string", example: "ghaziabad" },
          bio: { type: "string", example: "Full stack developer with 3+ years experience" },
          resume_id: { type: "integer", nullable: true, example: 5 },
          resume_name: { type: "string", nullable: true, example: "siddharth_resume.pdf" },
          resume_url: { type: "string", nullable: true, example: "https://ik.imagekit.io/jobportal/resumes/siddharth_resume.pdf" },
          created_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" },
          updated_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
        }
      },
      Company: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          recruiter_id: { type: "integer", example: 3 },
          company_name: { type: "string", example: "Tech Solutions Inc" },
          description: { type: "string", example: "Leading software engineering agency" },
          website: { type: "string", example: "https://techsolutions.example.com" },
          location: { type: "string", example: "Ghaziabad,UP" },
          industry: { type: "string", example: "Information Technology" },
          logo_id: { type: "integer", nullable: true, example: 12 },
          logo_url: { type: "string", nullable: true, example: "https://ik.imagekit.io/jobportal/logos/techsolutions.png" },
          created_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
        }
      },
      Job: {
        type: "object",
        properties: {
          id: { type: "integer", example: 10 },
          recruiter_id: { type: "integer", example: 3 },
          company_id: { type: "integer", example: 1 },
          title: { type: "string", example: "Senior Backend Developer" },
          description: { type: "string", example: "We are seeking an experienced Backend Engineer skilled in Node.js and Redis." },
          location: { type: "string", example: "Remote / San Francisco" },
          job_type: { type: "string", example: "Full-Time" },
          salary_min: { type: "number", example: 90000 },
          salary_max: { type: "number", example: 130000 },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["Node.js", "PostgreSQL", "Redis", "Docker"]
          },
          experience: { type: "integer", example: 4 },
          deadline: { type: "string", format: "date", example: "2026-12-31" },
          company_name: { type: "string", example: "Tech Solutions Inc" },
          company_location: { type: "string", example: "Ghaziabad,UP" },
          industry: { type: "string", example: "Information Technology" },
          company_website: { type: "string", example: "https://techsolutions.example.com" },
          created_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
        }
      },
      Application: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          job_id: { type: "integer", example: 10 },
          candidate_id: { type: "integer", example: 2 },
          resume_id: { type: "integer", example: 5 },
          cover_letter: { type: "string", example: "I have over 3 years of building REST APIs and would love to join your team." },
          status: { type: "string", enum: ["Applied", "Shortlisted", "Interview", "Rejected", "Selected"], example: "Applied" },
          job_title: { type: "string", example: "Senior Backend Developer" },
          company_name: { type: "string", example: "Tech Solutions Inc" },
          resume_name: { type: "string", example: "john_doe_resume.pdf" },
          resume_url: { type: "string", example: "https://ik.imagekit.io/jobportal/resumes/john_resume.pdf" },
          created_at: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid input or resource not found" },
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["Field 'email' must be a valid email address"]
          }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Check API Health Status",
        tags: ["System"],
        description: "Returns the health and operational status of the server.",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time", example: "2026-09-16T10:00:00.000Z" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        summary: "Register a new user account",
        tags: ["Auth"],
        description: "Creates a new user account with role `candidate`, `recruiter`, or `admin`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Siddharth" },
                  email: { type: "string", format: "email", example: "siddharth123@example.com" },
                  password: { type: "string", format: "password", example: "Siddharth@123" },
                  role: { type: "string", enum: ["candidate", "recruiter", "admin"], default: "candidate", example: "candidate" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User registered successfully" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          400: {
            description: "Validation error or missing fields",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          },
          409: {
            description: "Email already registered",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          },
          500: {
            description: "Internal server error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Log in with email and password",
        tags: ["Auth"],
        description: "Authenticates user credentials, sets an HTTP-only cookie, and returns a signed JWT token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "siddharth123@example.com" },
                  password: { type: "string", format: "password", example: "Siddharth@123" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Login successful" },
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          400: {
            description: "Email and password required",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          },
          401: {
            description: "Invalid credentials",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          },
          403: {
            description: "Account is blocked by administrator",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          },
          500: {
            description: "Internal server error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/auth/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Auth"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Current user profile fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          401: {
            description: "Unauthorized - Token missing or invalid",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/auth/logout": {
      post: {
        summary: "Logout user and clear session cookie",
        tags: ["Auth"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Logout successful" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/candidates/createprofile": {
      post: {
        summary: "Create Candidate Profile with optional resume",
        tags: ["Candidate Profile"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Creates candidate profile for authenticated user (Role: candidate). Supports multipart/form-data for resume upload (PDF/DOC).",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  phone: { type: "string", example: "+1234567890" },
                  skills: { type: "string", description: "Comma-separated skills or array", example: "Node.js, PostgreSQL, Docker" },
                  education: { type: "string", example: "B.S. in Computer Science" },
                  experience: { type: "integer", example: 3 },
                  location: { type: "string", example: "Ghaziabad,UP" },
                  bio: { type: "string", example: "Backend engineer focused on scalable microservices" },
                  resume: { type: "string", format: "binary", description: "Resume file (PDF, DOC, DOCX up to 5MB)" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Candidate profile created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Profile created successfully" },
                    profile: { $ref: "#/components/schemas/CandidateProfile" }
                  }
                }
              }
            }
          },
          400: { description: "Invalid input or file format" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Requires Candidate role" }
        }
      }
    },
    "/api/candidates/getprofile": {
      get: {
        summary: "Get Candidate Profile",
        tags: ["Candidate Profile"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Retrieves candidate profile and resume details of authenticated user.",
        responses: {
          200: {
            description: "Candidate profile retrieved",
            content: { "application/json": { schema: { $ref: "#/components/schemas/CandidateProfile" } } }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Profile not found" }
        }
      }
    },
    "/api/candidates/updateprofile": {
      put: {
        summary: "Update Candidate Profile",
        tags: ["Candidate Profile"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Updates existing candidate profile and optionally replaces resume.",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  phone: { type: "string", example: "+1234567890" },
                  skills: { type: "string", example: "Node.js, PostgreSQL, Redis, Kubernetes" },
                  education: { type: "string", example: "M.S. in Software Engineering" },
                  experience: { type: "integer", example: 5 },
                  location: { type: "string", example: "Noida" },
                  bio: { type: "string", example: "Senior Backend Developer" },
                  resume: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Profile updated successfully" },
                    profile: { $ref: "#/components/schemas/CandidateProfile" }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" }
        }
      }
    },
    "/api/companies/createcompany": {
      post: {
        summary: "Create Company Profile",
        tags: ["Company"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Registers a company profile for recruiter with optional company logo.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["companyName"],
                properties: {
                  companyName: { type: "string", example: "Acme Corp" },
                  description: { type: "string", example: "Innovative cloud technologies" },
                  website: { type: "string", example: "https://acme.example.com" },
                  location: { type: "string", example: "Ghaziabad,UP" },
                  industry: { type: "string", example: "Technology" },
                  logo: { type: "string", format: "binary", description: "Company logo image (JPG, PNG)" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Company created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Company created successfully" },
                    company: { $ref: "#/components/schemas/Company" }
                  }
                }
              }
            }
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Requires Recruiter role" }
        }
      }
    },
    "/api/companies/getcompany": {
      get: {
        summary: "Get Recruiter's Company Profile",
        tags: ["Company"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Company fetched successfully",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } }
          },
          404: { description: "Company not found" }
        }
      }
    },
    "/api/companies/updatecompany": {
      put: {
        summary: "Update Company Profile",
        tags: ["Company"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  companyName: { type: "string", example: "Acme Corp International" },
                  description: { type: "string", example: "Enterprise Cloud and AI Solutions" },
                  website: { type: "string", example: "https://acme-global.example.com" },
                  location: { type: "string", example: "Noida" },
                  industry: { type: "string", example: "Cloud Computing" },
                  logo: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Company updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Company updated successfully" },
                    company: { $ref: "#/components/schemas/Company" }
                  }
                }
              }
            }
          },
          404: { description: "Company not found" }
        }
      }
    },
    "/api/jobs/getalljob": {
      get: {
        summary: "Get all job postings (Cached with Redis)",
        tags: ["Jobs"],
        description: "Retrieves list of active jobs with search & filter support. Responses are cached in Redis with high performance and invalidated automatically on job updates.",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Keyword search across title and description" },
          { name: "location", in: "query", schema: { type: "string" }, description: "Filter by job location" },
          { name: "jobType", in: "query", schema: { type: "string" }, description: "Filter by job type (e.g. Full-Time, Part-Time, Remote)" },
          { name: "companyId", in: "query", schema: { type: "integer" }, description: "Filter by Company ID" }
        ],
        responses: {
          200: {
            description: "List of jobs fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    source: { type: "string", enum: ["redis", "database"], example: "redis" },
                    count: { type: "integer", example: 5 },
                    jobs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Job" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/jobs/getajob/{id}": {
      get: {
        summary: "Get a single job posting by ID (Cached with Redis)",
        tags: ["Jobs"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 10 }
        ],
        responses: {
          200: {
            description: "Job details fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    source: { type: "string", enum: ["redis", "database"], example: "redis" },
                    job: { $ref: "#/components/schemas/Job" }
                  }
                }
              }
            }
          },
          404: { description: "Job not found" }
        }
      }
    },
    "/api/jobs/createjob": {
      post: {
        summary: "Create a new job posting",
        tags: ["Jobs"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Creates a job post for recruiter's company and invalidates Redis list cache.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["companyId", "title", "description", "jobType"],
                properties: {
                  companyId: { type: "integer", example: 1 },
                  title: { type: "string", example: "Senior Backend Developer" },
                  description: { type: "string", example: "Looking for a seasoned backend engineer with Node.js and PostgreSQL experience." },
                  location: { type: "string", example: "San Francisco, CA (or Remote)" },
                  jobType: { type: "string", example: "Full-Time" },
                  salaryMin: { type: "number", example: 100000 },
                  salaryMax: { type: "number", example: 140000 },
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    example: ["Node.js", "Express", "PostgreSQL", "Redis"]
                  },
                  experience: { type: "integer", example: 3 },
                  deadline: { type: "string", format: "date", example: "2026-12-31" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Job created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Job created successfully" },
                    job: { $ref: "#/components/schemas/Job" }
                  }
                }
              }
            }
          },
          400: { description: "Validation error" },
          403: { description: "Forbidden - Not authorized for this company" },
          404: { description: "Company not found" }
        }
      }
    },
    "/api/jobs/updateajob/{id}": {
      put: {
        summary: "Update an existing job posting",
        tags: ["Jobs"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 10 }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Lead Backend Architect" },
                  description: { type: "string", example: "Lead our backend infrastructure and microservices." },
                  location: { type: "string", example: "Remote" },
                  jobType: { type: "string", example: "Full-Time" },
                  salaryMin: { type: "number", example: 120000 },
                  salaryMax: { type: "number", example: 160000 },
                  skills: { type: "array", items: { type: "string" }, example: ["Node.js", "Redis", "Kafka"] },
                  experience: { type: "integer", example: 5 },
                  deadline: { type: "string", format: "date", example: "2026-12-31" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Job updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Job updated successfully" },
                    job: { $ref: "#/components/schemas/Job" }
                  }
                }
              }
            }
          },
          404: { description: "Job not found or unauthorized" }
        }
      }
    },
    "/api/jobs/deletejob/{id}": {
      delete: {
        summary: "Delete a job posting",
        tags: ["Jobs"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 10 }
        ],
        responses: {
          200: {
            description: "Job deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Job deleted successfully" }
                  }
                }
              }
            }
          },
          404: { description: "Job not found or unauthorized" }
        }
      }
    },
    "/api/applications/applyforjob": {
      post: {
        summary: "Apply for a job posting",
        tags: ["Applications"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        description: "Submits candidate job application using the candidate's uploaded resume.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["jobId"],
                properties: {
                  jobId: { type: "integer", example: 10 },
                  coverLetter: { type: "string", example: "I have 4 years of experience and am excited to apply." }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Application submitted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Application submitted successfully" },
                    application: { $ref: "#/components/schemas/Application" }
                  }
                }
              }
            }
          },
          400: { description: "Missing job ID or candidate has not uploaded a resume" },
          409: { description: "Candidate has already applied for this job" }
        }
      }
    },
    "/api/applications/myapplication": {
      get: {
        summary: "Get all applications submitted by candidate",
        tags: ["Applications"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Applications retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    applications: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Application" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/users": {
      get: {
        summary: "Get all users (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Users fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Users fetched successfully" },
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
          },
          403: { description: "Forbidden - Requires Admin role" }
        }
      }
    },
    "/api/admin/users/{id}": {
      get: {
        summary: "Get user by ID (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 2 }
        ],
        responses: {
          200: {
            description: "User details retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User fetched successfully" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          404: { description: "User not found" }
        }
      }
    },
    "/api/admin/users/{id}/block": {
      put: {
        summary: "Block a user account (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 2 }
        ],
        responses: {
          200: {
            description: "User account blocked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User blocked successfully" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          400: { description: "Invalid user ID or admin trying to block themselves" },
          404: { description: "User not found" }
        }
      }
    },
    "/api/admin/users/{id}/unblock": {
      put: {
        summary: "Unblock a user account (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 2 }
        ],
        responses: {
          200: {
            description: "User account unblocked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User unblocked successfully" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          404: { description: "User not found" }
        }
      }
    },
    "/api/admin/jobs": {
      get: {
        summary: "Get all platform job postings (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: "Jobs fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Jobs fetched successfully" },
                    jobs: {
                      type: "array",
                      items: {
                        allOf: [
                          { $ref: "#/components/schemas/Job" },
                          {
                            type: "object",
                            properties: {
                              recruiter_name: { type: "string", example: "Jane Recruiter" }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/admin/jobs/{id}": {
      delete: {
        summary: "Delete any job posting by ID (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 10 }
        ],
        responses: {
          200: {
            description: "Job deleted by admin successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Job deleted successfully" },
                    job: { $ref: "#/components/schemas/Job" }
                  }
                }
              }
            }
          },
          404: { description: "Job not found" }
        }
      }
    }
  }
};

const setupSwagger = (app) => {
  // Serve Swagger UI on /api-docs
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Job Portal API Documentation"
    })
  );

  // Serve raw JSON spec on /api-docs.json
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(swaggerSpec);
  });
};

module.exports = {
  swaggerSpec,
  setupSwagger
};
