/* eslint-disable no-unused-vars */
import { Divider, Spin, Checkbox, Button, Collapse, Input } from "antd";
import React, { useEffect, useState } from "react";
import {
  useGetSubjectsQuery,
  useFetchSystemBySubjectArrayMutation,
  useCreateQuizMutation,
  useFetchSubSystemBySystemArrayMutation,
} from "../store/subjectSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdvanceQuiz() {
  const {
    data: subjectData = {},
    isLoading,
    isFetching: isFetchingSubjects,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery();
  const navigate = useNavigate();

  const [fetchSystemBySubjectArray, { isLoading: systemLoading }] =
    useFetchSystemBySubjectArrayMutation();
  const [fetchSubSystemBySystemArray, { isLoading: subsystemLoading }] =
    useFetchSubSystemBySystemArrayMutation();

  const [createQuiz, { isLoading: quizLoading }] = useCreateQuizMutation();

  const [subjectList, setSubjectList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [subsystemList, setSubsystemList] = useState([]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [selectedSubsystems, setSelectedSubsystems] = useState([]);
  const [questionsPerSystem, setQuestionsPerSystem] = useState(1);

  // Load Subjects
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

  // Subject checkbox change
  const handleSubjectChange = (value, checked) => {
    setSelectedSubjects((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // System checkbox change
  const handleSystemChange = (value, checked) => {
    setSelectedSystems((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // Subsystem checkbox change
  const handleSubsystemChange = (value, checked) => {
    setSelectedSubsystems((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // Fetch systems based on subjects
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
        setSubsystemList([]); // reset subsystems
        setSelectedSubsystems([]); // reset selected subsystems
      }
    } catch (error) {
      toast.error("Failed to load systems");
      console.error("API Error (Systems):", error);
    }
  };

  // Fetch subsystems based on systems
  const handleFetchSubsystems = async () => {
    try {
      const response = await fetchSubSystemBySystemArray({
        systemIds: selectedSystems,
      }).unwrap();

      if (response?.success && Array.isArray(response?.data)) {
        const updatedSubsystems = response.data.map((item) => ({
          label: item.subSystem_name || item.subsystem || "Unnamed Subsystem",
          value: item._id,
          countQuestions: item.questionCount || 0,
        }));
        setSubsystemList(updatedSubsystems);
        setSelectedSubsystems([]); // reset when new subsystems load
      }
    } catch (error) {
      toast.error("Failed to load subsystems");
      console.error("API Error (Subsystems):", error);
    }
  };

  // Create Quiz
  const createQuizFun = async () => {
    try {
      const response = await createQuiz({
        systems: [...selectedSystems, ...selectedSubsystems],

        durationMinutes: 15,
      }).unwrap();

      console.log("Quiz API Response:", response);

      if (response?.success) {
        toast.success(response.message || "Quiz created!");

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
    <Spin
      spinning={isLoading || systemLoading || subsystemLoading || quizLoading}
      className="p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Advanced Quiz Creation</h1>

      {/* Subjects Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Step 1: Select Subjects</h2>
        <Divider />

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            className="!my-5"
            size="large"
            loading={isFetchingSubjects}
            onClick={refetchSubjects}
          >
            Refetch Subjects
          </Button>
          {/* <div className="w-[200px]">
            <Input
              placeholder="no questions per system"
              type="number"
              width={200}
              min={1}
              size="large"
              className="w-full"
              onChange={(e) => setQuestionsPerSystem(e.target.value)}
            />
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {subjectList.map((item) => (
            <Checkbox
              key={item.value}
              checked={selectedSubjects.includes(item.value)}
              onChange={(e) =>
                handleSubjectChange(item.value, e.target.checked)
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
          onClick={handleFetchSystems}
          disabled={selectedSubjects.length === 0}
        >
          Load Systems
        </Button>
      </div>

      {/* Systems Section */}
      {systemList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Step 2: Select Systems</h2>
          <Divider />

          <div className="grid grid-cols-2 gap-3 mb-4">
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
            onClick={handleFetchSubsystems}
            disabled={selectedSystems.length === 0}
          >
            Load Sub Systems
          </Button>
        </div>
      )}

      {/* Subsystems Section */}
      {subsystemList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Step 3: Select Sub Systems</h2>
          <Divider />

          <div className="grid grid-cols-2 gap-3 mb-4">
            {subsystemList.map((item) => (
              <Checkbox
                key={item.value}
                checked={selectedSubsystems.includes(item.value)}
                onChange={(e) =>
                  handleSubsystemChange(item.value, e.target.checked)
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
            disabled={selectedSubsystems.length === 0}
          >
            Create Quiz
          </Button>
        </div>
      )}
    </Spin>
  );
}
