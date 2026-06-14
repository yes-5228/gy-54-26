from ..models import Student, Grade
from .gpa import calculate_summary

FAIL_THRESHOLD = 2
GPA_THRESHOLD = 2.0


def get_warning_students():
    students = Student.query.order_by(Student.student_no.asc()).all()
    warning_list = []

    for student in students:
        grades = Grade.query.filter_by(student_id=student.id).all()
        if not grades:
            continue

        summary = calculate_summary(grades)
        fail_count = sum(1 for grade in grades if grade.score < 60)

        reasons = []
        if fail_count >= FAIL_THRESHOLD:
            reasons.append(f"挂科{fail_count}门")
        if summary["gpa"] < GPA_THRESHOLD:
            reasons.append(f"绩点{summary['gpa']}偏低")

        if reasons:
            fail_courses = [
                {
                    "courseCode": grade.course_code,
                    "courseName": grade.course_name,
                    "score": grade.score,
                    "credit": grade.credit,
                    "semester": grade.semester,
                }
                for grade in grades
                if grade.score < 60
            ]
            warning_list.append({
                "student": student.to_dict(),
                "summary": summary,
                "failCount": fail_count,
                "failCourses": fail_courses,
                "reasons": reasons,
            })

    return warning_list
