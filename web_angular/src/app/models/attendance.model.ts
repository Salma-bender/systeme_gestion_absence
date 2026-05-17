export interface Attendance {
  id: number;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  sessionId: number;
  sessionSubject: string;
  sessionCode: string;
  detectedAt: string;
}
