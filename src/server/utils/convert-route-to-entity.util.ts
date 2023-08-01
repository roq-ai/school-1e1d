const mapping: Record<string, string> = {
  'it-staffs': 'it_staff',
  schools: 'school',
  students: 'student',
  teachers: 'teacher',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
