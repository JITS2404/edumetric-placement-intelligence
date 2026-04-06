export async function fetchStudents() {
  const response = await fetch('http://localhost:3001/api/students');
  return response.json();
}

export async function fetchPlacementStats() {
  const response = await fetch('http://localhost:3001/api/placement-stats');
  return response.json();
}

export async function createStudent(student: any) {
  const response = await fetch('http://localhost:3001/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  return response.json();
}
