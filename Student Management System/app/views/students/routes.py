from math import ceil
from flask import request
from flask import render_template
from flask import redirect
from flask import flash
from flask.helpers import url_for
from app.models.student import Student
from app.models.course import Course
from app.models.college import College
from .utils import add_student_to_db
from .utils import update_student_record
from .utils import check_page_limit
from .utils import check_limit_validity
from . import student


current_page = 1
student_limit = 5


@student.route('/')
def index():
    data = 1
    return render_template("menu.html", data=data)

@student.route('/about')
def about_page():
    return render_template("about.html")

@student.route('/students', methods=['GET', 'POST'])
def students() -> str:
    global student_limit

    min_page = request.args.get('min_page')
    max_page = request.args.get('max_page')
    page_limit = check_page_limit(min_page, max_page)
    student_count = str(Student().get_total())
    entered_limit = request.args.get('limit-field')
    if entered_limit == student_count:
        page_limit = 'min-and-max'
    try:
        student_limit = check_limit_validity(int(entered_limit), int(student_count))
    except:
        student_limit = student_limit
    students = Student().get_all(current_page, student_limit)
    courses = Course().get_all(paginate=False)
    colleges = College().get_all(paginate=False)
    return render_template('students.html',
        data = [students,courses,colleges],
        datacount = student_count,
        student_limit = student_limit,
        limit = page_limit)


@student.route('/students/next', methods=['GET', 'POST'])
def next() -> str:
    global current_page
    student_count = Student().get_total()
    current_page += 1
    limit_page = ceil(student_count/student_limit)
    max_page_reached = current_page == limit_page

    if not max_page_reached:
        return redirect(url_for('student.students', page_num=current_page))
    else:
        return redirect(url_for('student.students', page_num=current_page, max_page=True))


@student.route('/students/prev', methods=['GET', 'POST'])
def prev() -> str:
    global current_page
    min_page_reached = current_page == 1

    if not min_page_reached:
        current_page -= 1
        return redirect(url_for('student.students', page_num=current_page))
    else:
        current_page = 1
        return redirect(url_for('student.students', page_num=current_page, min_page=True))


@student.route('/students/search', methods=['GET', 'POST'])
def search() -> str:
    if request.method == 'POST':

        user_input = request.form.get('user-input')
        field = request.form.get('field')

        if field == 'select':
            result = Student().search(keyword=user_input)
        elif field == 'id':
            result = Student().search(keyword=user_input, field='id')
        elif field == 'first':
            result = Student().search(keyword=user_input, field='firstname')
        elif field == 'middle':
            result = Student().search(keyword=user_input, field='middlename')
        elif field == 'last':
            result = Student().search(keyword=user_input, field='lastname')
        elif field == 'gender':
            result = Student().search(keyword=user_input, field='gender')
        elif field == 'year':
            result = Student().search(keyword=user_input, field='year')
        elif field == 'course':
            result = Student().search(keyword=user_input, field='course')
        else:
            result = []

        if len(result) != 0:
            return render_template('students.html', 
                                    data=[result],
                                    datacount = str(len(result)),
                                    student_limit = '5',
                                   )
        else:
            flash(f'No student found', 'info')
            return render_template('students.html', 
                                    data=[result],
                                    datacount = str(len(result)),
                                    student_limit = '5',
                                   )
    else:
        return redirect(url_for('student.students'))


@student.route('/students/add', methods=['GET', 'POST'])
def add() -> str:
    if request.method == 'POST':
        student = {
            'id': request.form.get('student-id'),
            'firstname': request.form.get('firstname'),
            'middlename': request.form.get('middlename'),
            'lastname': request.form.get('lastname'),
            'gender': request.form.get('gender'),
            'yearlevel': request.form.get('yearlevel'),
            'course': request.form.get('course')
        }
        added = add_student_to_db(student)
        if added:
            flash(f'{student["firstname"]} is added succesfully!', 'success')
        else:
            flash(f'{student["firstname"]} cannot be added. Make sure the ID is unique.', 'info')
        return redirect(url_for('student.students'))
    else:
        courses = Course().get_all(paginate=False)
        colleges = College().get_all(paginate=False)
        return render_template('form.html', 
                                data = [[],courses,colleges])


@student.route('/students/update/<string:id>', methods=['GET', 'POST'])
def update(id: str) -> str:
    if request.method == 'POST':
        student = {
        'id': id,
        'firstname': request.form.get('firstname'),
        'middlename': request.form.get('middlename'),
        'lastname': request.form.get('lastname'),
        'gender': request.form.get('gender'),
        'yearlevel': request.form.get('yearlevel'),
        'course': request.form.get('course'),
        }
        update_student_record(student)

        flash(f"{student['firstname']}'s data has been changed succesfully!", 'info')
        return redirect(url_for('student.students'))

    else:
        return redirect(url_for('student.students'))


@student.route('/students/delete/<string:id>')
def delete(id: str) -> str:
    data = Student().get_student(id)
    Student().delete(id)
    flash(f'{data[0]} deleted from the database.', 'info')
    return redirect(url_for('student.students'))
