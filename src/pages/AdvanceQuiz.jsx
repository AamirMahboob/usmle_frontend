import { Divider, Spin, Checkbox, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  useGetSubjectsQuery,
  useFetchSystemBySubjectArrayMutation,
  useCreateQuizMutation,
} from "../store/subjectSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

export default function AdvanceQuiz() {
  const { data: subjectData = {}, isLoading } = useGetSubjectsQuery();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const [fetchSystemBySubjectArray, { isLoading: systemLoading }] =
    useFetchSystemBySubjectArrayMutation();

  const [createQuiz, { isLoading: quizLoading }] = useCreateQuizMutation();

  const [subjectList, setSubjectList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);

  // ✅ Load Subjects
  useEffect(() => {
    if (subjectData?.success && Array.isArray(subjectData?.data)) {
      const updatedArray = subjectData.data.map((item) => ({
        label: item.subject,
        value: item._id,
        countQuestions: item.questionCount || item.countQuestions || 0,
      }));
      setSubjectList(updatedArray);
    } else {
      setSubjectList([]);
    }
  }, [subjectData]);

  // ✅ Subject checkbox change
  const handleSubjectChange = (value, checked) => {
    setSelectedSubjects((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // ✅ System checkbox change
  const handleSystemChange = (value, checked) => {
    setSelectedSystems((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // ✅ Fetch systems based on subjects
  const handleFetchSystems = async () => {
    try {
      const response = await fetchSystemBySubjectArray({
        subjectIds: selectedSubjects,
      }).unwrap();

      if (response?.success && Array.isArray(response?.data)) {
        const updatedSystems = response.data.map((item) => ({
          label: item.system_name || item.system || "Unnamed System",
          value: item._id,
          countQuestions: item.questionCount || 0,
        }));
        setSystemList(updatedSystems);
        setSelectedSystems([]); // reset when new systems load
      }
    } catch (error) {
      toast.error("Failed to load systems");
      console.error("API Error (Systems):", error);
    }
  };

  // ✅ Create Quiz
  const createQuizFun = async () => {
    try {
      const response = await createQuiz({
        systems: selectedSystems,
        questionsPerSystem: 2,
        durationMinutes: 15,
      }).unwrap();

      console.log("Quiz API Response:", response);

      if (response?.success) {
        toast.success(response.message || "Quiz created!");

        // ✅ Ensure quizId exists before navigating
        if (response.quiz?.quizId) {
          navigate(`/dashboard/quiz/${response.quiz?.quizId}`);
        } else {
          console.warn("Quiz created but quizId not found in response");
        }
      } else {
        toast.error(response?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Quiz creation failed!");
      console.error("Quiz API Error:", error);
    }
  };

  return (
    <Spin spinning={isLoading || systemLoading || quizLoading} className="p-4">
      {/* Subjects Section */}
      <h1 className="text-2xl font-bold">Subjects</h1>
      <Divider />

      <div className="grid grid-cols-2 gap-3">
        {subjectList.map((item) => (
          <Checkbox
            key={item.value}
            checked={selectedSubjects.includes(item.value)}
            onChange={(e) => handleSubjectChange(item.value, e.target.checked)}
          >
            {item.label}{" "}
            <span className="text-gray-500 text-sm">
              ({item.countQuestions})
            </span>
          </Checkbox>
        ))}
      </div>

      <Button
        type="primary"
        onClick={handleFetchSystems}
        disabled={selectedSubjects.length === 0}
        className="!mt-4"
      >
        Load Systems
      </Button>

      {/* Systems Section */}
      {systemList.length > 0 && (
        <>
          <Divider />
          <h1 className="text-2xl font-bold">Systems</h1>
          <Divider />

          <div className="grid grid-cols-2 gap-3">
            {systemList.map((item) => (
              <Checkbox
                key={item.value}
                checked={selectedSystems.includes(item.value)}
                onChange={(e) =>
                  handleSystemChange(item.value, e.target.checked)
                }
              >
                {item.label}{" "}
                <span className="text-gray-500 text-sm">
                  ({item.countQuestions})
                </span>
              </Checkbox>
            ))}
          </div>

          <Button
            type="primary"
            onClick={createQuizFun}
            loading={quizLoading}
            disabled={selectedSystems.length === 0}
            className="!mt-4"
          >
            Create Quiz
          </Button>
        </>
      )}
    </Spin>
  );
}
