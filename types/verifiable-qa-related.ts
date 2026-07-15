export interface RelatedQaResponse {
  total: number;
  relatedQa: RelatedQa[];
  undefinedCourseQa: RelatedQa[];
}

export interface RelatedQa {
  verifiableQaId: number;
  messageId: string;
  userId: number;

  originalQuestion: string;
  rewrittenQuestion: string;

  /**
   * Backend đang trả generatedAnswer dưới dạng JSON string.
   * Cần JSON.parse() trước khi sử dụng.
   */
  generatedAnswer: string;

  status: number;
  createdAt: string;

  user: QaUser;
  courses: QaCourse[];
}

export interface QaUser {
  userId: number;
  majorId: number | null;
  majorName: string | null;
  email: string;
  name: string;
  cohort: string | number | null;
  accountStatus: string;
}

export interface QaCourse {
  courseId: number;
  courseCode: string;
  courseName: string;
}