import React, { useState } from 'react';
import styled from 'styled-components';

const AddCourse = () => {
  const [courses, setCourses] = useState([]);
  const [tempCourse, setTempCourse] = useState('');
  const [tempFile, setTempFile] = useState(null);

  const handleAddCourse = () => {
    setCourses([...courses, { course: tempCourse, file: tempFile }]);
    setTempCourse('');
    setTempFile(null);
  };

  const handleCancel = () => {
    setTempCourse('');
    setTempFile(null);
  };

  const handleAddAnother = () => {
    setTempCourse('');
    setTempFile(null);
  };

  const handleFileChange = (e) => {
    setTempFile(e.target.files[0]);
  };

  return (
    <Container>
      {courses.map((course, index) => (
        <Layout key={index}>
          <div>
            <input type="text" value={course.course} readOnly />
          </div>
          <div>
            <input type="file" onChange={handleFileChange} />
          </div>
        </Layout>
      ))}
      <Layout>
        <div>
          <input
            type="text"
            name="course"
            value={tempCourse}
            onChange={(e) => setTempCourse(e.target.value)}
          />
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
      </Layout>
      <Button>
        <button onClick={handleAddCourse}>Add Course</button>
        <button onClick={handleCancel}>Cancel</button>
      </Button>
      <Another>
        <button onClick={handleAddAnother}>Add another course</button>
      </Another>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Layout = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Button = styled.div``;

const Another = styled.div``;

export default AddCourse;
