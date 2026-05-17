const request = require('supertest');
const app = require('./server');

describe('Task Management API - Unit Tests', () => {
    
    // 1. Normal Case: Get all tasks
    it('GET /tasks --> should return an array of tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // 2. Edge Case: Get task by non-existent ID
    it('GET /tasks/:id --> should return 404 for invalid ID', async () => {
        const res = await request(app).get('/tasks/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Task not found');
    });

    // 3. Normal Case: Create a new task
    it('POST /tasks --> should create a new task successfully', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({
                title: "Learn CI/CD Pipeline",
                description: "Understand GitHub Actions for assignment"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Learn CI/CD Pipeline');
    });

    // 4. Invalid Case: Update task with empty title (Testing our Refactored Code)
    it('PUT /tasks/:id --> should return 400 Bad Request for empty title', async () => {
        const res = await request(app)
            .put('/tasks/1')
            .send({
                title: "", // Invalid input
                description: "Updated description"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain('Validation Error');
    });

    // 5. Normal Case: Delete a task
    it('DELETE /tasks/:id --> should delete the task successfully', async () => {
        const res = await request(app).delete('/tasks/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Task deleted successfully');
    });
});