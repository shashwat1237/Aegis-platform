def calculate_vix(severity: int, blast_radius: int, time_delta: float = 0.0) -> float:
    try:
        # We ensure a minimum safe time to prevent division by zero errors during the demo.
        safe_time = max(float(time_delta), 1.0)
        # We weight severity (1.5x) higher than radius because broken columns are more critical than slow queries.
        weighted_severity = float(severity) * 1.5
        # Our core formula: (Severity * Blast Radius) / Time Delta.
        raw_score = (weighted_severity * float(blast_radius)) / safe_time * 100.0
        # We clamp the score between 0-100 to ensure the UI gauge component doesn't break.
        return min(max(round(raw_score, 1), 0.0), 100.0)
    except Exception:
        return 50.0