export interface Session {
  id: number;
  subject: string;
  code: string;
  teacherName: string;
  createdAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface SessionRequest {
  subject: string;
  teacherId: number;
  durationMinutes: number;
}
