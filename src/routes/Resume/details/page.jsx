import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe } from "react-icons/fi";

const ResumeDetail = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchResume = async () => {
        try {
            const token = localStorage.getItem("token");
            setLoading(true);

            const { data } = await axios.get(`https://resume-backend-s69p.onrender.com/api/resume/get/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setResume(data.resume);
        } catch (error) {
            console.error(error);
            alert("Error fetching resume details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResume();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!resume) return <div className="p-6 text-center">Resume not found</div>;

    // Helper function to format dates
    const formatDate = (date) => {
        if (!date) return "Present";
        return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 dark:bg-zinc-950 sm:p-6">
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow dark:bg-zinc-900 sm:p-8">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <img
                        src={
                            resume.profileImage?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqus0S7qc6GLn7yh44WPR7MzR1DSM81WI6ng&s"
                        }
                        alt={resume.fullName || "Profile Image"}
                        className="h-28 w-28 rounded-full border-2 border-purple-400 object-cover sm:h-32 sm:w-32"
                    />

                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-purple-700 sm:text-3xl">{resume.fullName}</h1>
                        <h2 className="mt-1 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">{resume.title || "-"}</h2>

                        {/* Contact Info */}
                        <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                            {resume.email && (
                                <ContactInfo
                                    icon={<FiMail />}
                                    text={resume.email}
                                />
                            )}
                            {resume.phone && (
                                <ContactInfo
                                    icon={<FiPhone />}
                                    text={resume.phone}
                                />
                            )}
                            {resume.address && (
                                <ContactInfo
                                    icon={<FiMapPin />}
                                    text={resume.address}
                                />
                            )}
                        </div>

                        {/* Links */}
                        <div className="mt-2 flex flex-col gap-2 text-sm text-blue-600 dark:text-blue-400 sm:flex-row sm:items-center sm:gap-4">
                            {resume.linkedin && (
                                <ContactInfo
                                    icon={<FiLinkedin />}
                                    link={resume.linkedin}
                                />
                            )}
                            {resume.website && (
                                <ContactInfo
                                    icon={<FiGlobe />}
                                    link={resume.website}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-purple-400" />

                {/* Summary */}
                <Section title="Professional Summary">
                    <p>{resume.summary || "-"}</p>
                </Section>

                {/* Experience */}
                {resume.experience?.length > 0 && (
                    <Section title="Experience">
                        <ul className="space-y-3">
                            {resume.experience.map((exp, idx) => (
                                <li
                                    key={idx}
                                    className="border-l-2 border-purple-400 pl-4"
                                >
                                    <p className="font-medium text-gray-800 dark:text-gray-100">{exp.position || "-"}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{exp.company || "-"}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-200">{exp.description}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Projects */}
                {resume.projects?.length > 0 && (
                    <Section title="Projects">
                        <ul className="space-y-3">
                            {resume.projects.map((proj, idx) => (
                                <li
                                    key={idx}
                                    className="border-l-2 border-purple-400 pl-4"
                                >
                                    <p className="font-medium text-gray-800 dark:text-gray-100">{proj.title}</p>
                                    <p className="text-gray-700 dark:text-gray-200">{proj.description}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Education */}
                {resume.education?.length > 0 && (
                    <Section title="Education">
                        <ul className="space-y-3">
                            {resume.education.map((edu, idx) => (
                                <li
                                    key={idx}
                                    className="border-l-2 border-purple-400 pl-4"
                                >
                                    <p className="font-medium text-gray-800 dark:text-gray-100">{edu.degree}</p>
                                    <p className="text-gray-600 dark:text-gray-300">{edu.institute}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Skills */}
                {resume.skills?.length > 0 && (
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="rounded-full bg-purple-100 px-2 py-1 text-sm text-purple-700"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Languages */}
                {resume.languages?.length > 0 && (
                    <Section title="Languages">
                        <ul className="flex flex-wrap gap-2">
                            {resume.languages.map((lang, idx) => (
                                <li
                                    key={idx}
                                    className="text-sm text-gray-700 dark:text-gray-200"
                                >
                                    • {lang}
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}
            </div>
        </div>
    );
};

// Reusable Section component
const Section = ({ title, children }) => (
    <section className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        {children}
    </section>
);

// Reusable ContactInfo component for icons + text or links
const ContactInfo = ({ icon, text, link }) => (
    <div className="flex items-center gap-1 break-all text-sm text-gray-700 dark:text-gray-400">
        {icon}
        {link ? (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
            >
                {link}
            </a>
        ) : (
            <span>{text}</span>
        )}
    </div>
);

export default ResumeDetail;
