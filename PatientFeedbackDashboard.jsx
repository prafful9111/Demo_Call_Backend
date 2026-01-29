import React, { useState, useEffect, useRef } from 'react';

const PatientFeedbackDashboard = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const API_BASE_URL = 'https://demo-call-backend-aziy.onrender.com'; // Update with your API URL

    // Fetch all evaluations
    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/evaluations`);
            const data = await response.json();
            setEvaluations(data);
        } catch (error) {
            console.error('Error fetching evaluations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvaluationDetails = async (id) => {
        try {
            setDetailLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/evaluations/${id}`);
            const data = await response.json();
            setSelectedEvaluation(data);
        } catch (error) {
            console.error('Error fetching evaluation details:', error);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleRowClick = (id) => {
        fetchEvaluationDetails(id);
    };

    const handleBackClick = () => {
        setSelectedEvaluation(null);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Audio player controls
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const parseTranscript = (transcript) => {
        if (!transcript) return [];
        const lines = transcript.split('\n\n');
        return lines.map((line) => {
            const match = line.match(/\[(.*?)\] (USER|AGENT): (.*)/);
            if (match) {
                return {
                    time: match[1],
                    speaker: match[2],
                    text: match[3],
                };
            }
            return null;
        }).filter(Boolean);
    };

    // Styles
    const styles = {
        container: {
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            padding: '24px',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
        },
        header: {
            marginBottom: '24px',
        },
        title: {
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0',
        },
        subtitle: {
            fontSize: '14px',
            color: '#64748b',
            margin: 0,
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        thead: {
            backgroundColor: '#f1f5f9',
            borderBottom: '2px solid #e2e8f0',
        },
        th: {
            padding: '16px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: '600',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        tr: {
            borderBottom: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
        },
        td: {
            padding: '16px',
            fontSize: '14px',
            color: '#334155',
        },
        badge: {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
        },
        detailContainer: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
        },
        backButton: {
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
        },
        section: {
            marginBottom: '32px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e2e8f0',
        },
        npsContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            border: '2px solid #bae6fd',
        },
        npsScore: {
            fontSize: '48px',
            fontWeight: '800',
            color: '#0284c7',
        },
        audioPlayer: {
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
        },
        audioControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        playButton: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'background-color 0.2s',
        },
        seekBar: {
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            appearance: 'none',
            backgroundColor: '#e2e8f0',
            outline: 'none',
        },
        timeDisplay: {
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500',
            minWidth: '100px',
        },
        transcriptContainer: {
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
        },
        transcriptLine: {
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'white',
        },
        transcriptTime: {
            fontSize: '11px',
            color: '#94a3b8',
            marginBottom: '4px',
        },
        transcriptSpeaker: {
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '4px',
        },
        transcriptText: {
            fontSize: '14px',
            color: '#334155',
            lineHeight: '1.6',
        },
        card: {
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #e2e8f0',
            transition: 'box-shadow 0.2s',
        },
        issueCard: {
            borderLeft: '4px solid',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '8px',
        },
        department: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#6366f1',
            backgroundColor: '#eef2ff',
            padding: '4px 8px',
            borderRadius: '4px',
        },
        evidence: {
            fontSize: '13px',
            color: '#64748b',
            fontStyle: 'italic',
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#f8fafc',
            borderRadius: '4px',
        },
        summaryList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        summaryItem: {
            padding: '12px',
            marginBottom: '8px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '3px solid #3b82f6',
            fontSize: '14px',
            color: '#334155',
            lineHeight: '1.6',
        },
        loadingSkeleton: {
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            height: '20px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
    };

    // Loading skeleton
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Patient Feedback Dashboard</h1>
                </div>
                <div style={styles.tableContainer}>
                    <div style={{ padding: '20px' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{ ...styles.loadingSkeleton, marginBottom: '12px' }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Detail view
    if (selectedEvaluation) {
        const transcriptLines = parseTranscript(selectedEvaluation.transcript);

        return (
            <div style={styles.container}>
                <button
                    style={styles.backButton}
                    onClick={handleBackClick}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
                >
                    ← Back to List
                </button>

                {detailLoading ? (
                    <div style={styles.detailContainer}>
                        <div style={styles.loadingSkeleton} />
                    </div>
                ) : (
                    <div style={styles.detailContainer}>
                        {/* Header Info */}
                        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                                {selectedEvaluation.staff_name}
                            </h2>
                            <div style={{ fontSize: '14px', color: '#64748b' }}>
                                {selectedEvaluation.call_date} • ID: {selectedEvaluation.staff_id}
                            </div>
                        </div>

                        {/* NPS Rating */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>NPS Rating</h3>
                            <div style={styles.npsContainer}>
                                <div style={styles.npsScore}>{selectedEvaluation.NPS_Rating.rating_number || 'N/A'}</div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>Out of 10</div>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                                        {selectedEvaluation.NPS_Rating.rating_justification || 'No justification provided'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audio Player */}
                        {selectedEvaluation.audio_url && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Call Recording</h3>
                                <div style={styles.audioPlayer}>
                                    <audio
                                        ref={audioRef}
                                        src={selectedEvaluation.audio_url}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={handleLoadedMetadata}
                                        onEnded={() => setIsPlaying(false)}
                                        style={{ display: 'none' }}
                                    />
                                    <div style={styles.audioControls}>
                                        <button
                                            style={styles.playButton}
                                            onClick={togglePlay}
                                            onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
                                            onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
                                        >
                                            {isPlaying ? '⏸' : '▶'}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={(currentTime / duration) * 100 || 0}
                                            onChange={handleSeek}
                                            style={styles.seekBar}
                                        />
                                        <div style={styles.timeDisplay}>
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transcript */}
                        {transcriptLines.length > 0 && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Transcript</h3>
                                <div style={styles.transcriptContainer}>
                                    {transcriptLines.map((line, idx) => (
                                        <div key={idx} style={styles.transcriptLine}>
                                            <div style={styles.transcriptTime}>{line.time}</div>
                                            <div
                                                style={{
                                                    ...styles.transcriptSpeaker,
                                                    color: line.speaker === 'USER' ? '#dc2626' : '#059669',
                                                }}
                                            >
                                                {line.speaker === 'USER' ? '👤 Customer' : '🎧 Agent'}
                                            </div>
                                            <div style={styles.transcriptText}>{line.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feedback Summary */}
                        {selectedEvaluation.Feedback_Summary.length > 0 && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Feedback Summary</h3>
                                <ul style={styles.summaryList}>
                                    {selectedEvaluation.Feedback_Summary.map((item, idx) => (
                                        <li key={idx} style={styles.summaryItem}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Issue Tickets */}
                        {selectedEvaluation.Issue_Tickets.length > 0 && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Issue Tickets ({selectedEvaluation.Issue_Tickets.length})</h3>
                                {selectedEvaluation.Issue_Tickets.map((issue, idx) => (
                                    <div
                                        key={idx}
                                        style={{ ...styles.card, ...styles.issueCard, borderLeftColor: getSeverityColor(issue.severity) }}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div style={styles.department}>{issue.department}</div>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    backgroundColor: getSeverityColor(issue.severity) + '20',
                                                    color: getSeverityColor(issue.severity),
                                                }}
                                            >
                                                {issue.severity}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>
                                            {issue.issue_description}
                                        </div>
                                        {issue.evidence && <div style={styles.evidence}>"{issue.evidence}"</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Patient Requests */}
                        {selectedEvaluation.Patient_Requests_Asks.length > 0 && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>Patient Requests ({selectedEvaluation.Patient_Requests_Asks.length})</h3>
                                {selectedEvaluation.Patient_Requests_Asks.map((request, idx) => (
                                    <div key={idx} style={{ ...styles.card, borderLeft: '4px solid #8b5cf6' }}>
                                        <div style={styles.cardHeader}>
                                            <div style={{ ...styles.department, backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                                                {request.department}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>
                                            {request.request_description}
                                        </div>
                                        {request.evidence && <div style={styles.evidence}>"{request.evidence}"</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Exceptional Highlights */}
                        {selectedEvaluation.Exceptional_Highlights_Compliments.length > 0 && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>
                                    Exceptional Highlights ({selectedEvaluation.Exceptional_Highlights_Compliments.length})
                                </h3>
                                {selectedEvaluation.Exceptional_Highlights_Compliments.map((highlight, idx) => (
                                    <div key={idx} style={{ ...styles.card, borderLeft: '4px solid #10b981' }}>
                                        <div style={styles.cardHeader}>
                                            <div style={{ ...styles.department, backgroundColor: '#d1fae5', color: '#059669' }}>
                                                {highlight.department}
                                            </div>
                                            <span style={{ fontSize: '20px' }}>⭐</span>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>
                                            {highlight.highlight_description}
                                        </div>
                                        {highlight.evidence && <div style={styles.evidence}>"{highlight.evidence}"</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Table view
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Patient Feedback Dashboard</h1>
                <p style={styles.subtitle}>Click on any row to view detailed feedback</p>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.thead}>
                        <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>NPS Rating</th>
                            <th style={styles.th}>Issues</th>
                            <th style={styles.th}>Highlights</th>
                            <th style={styles.th}>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluations.map((evaluation) => (
                            <tr
                                key={evaluation.id}
                                style={styles.tr}
                                onClick={() => handleRowClick(evaluation.id)}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <td style={styles.td}>{evaluation.display_date}</td>
                                <td style={styles.td}>
                                    <span
                                        style={{
                                            ...styles.badge,
                                            backgroundColor: evaluation.nps_rating >= 8 ? '#d1fae5' : evaluation.nps_rating >= 6 ? '#fef3c7' : '#fee2e2',
                                            color: evaluation.nps_rating >= 8 ? '#059669' : evaluation.nps_rating >= 6 ? '#d97706' : '#dc2626',
                                        }}
                                    >
                                        {evaluation.nps_rating || 'N/A'} / 10
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span
                                        style={{
                                            ...styles.badge,
                                            backgroundColor: evaluation.issue_count > 2 ? '#fee2e2' : '#f1f5f9',
                                            color: evaluation.issue_count > 2 ? '#dc2626' : '#475569',
                                        }}
                                    >
                                        {evaluation.issue_count} {evaluation.issue_count === 1 ? 'issue' : 'issues'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span
                                        style={{
                                            ...styles.badge,
                                            backgroundColor: '#d1fae5',
                                            color: '#059669',
                                        }}
                                    >
                                        {evaluation.highlight_count} {evaluation.highlight_count === 1 ? 'highlight' : 'highlights'}
                                    </span>
                                </td>
                                <td style={{ ...styles.td, fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    {evaluation.id.substring(0, 8)}...
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientFeedbackDashboard;
