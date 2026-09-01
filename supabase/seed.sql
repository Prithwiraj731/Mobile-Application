-- ============================================================================
-- SECURE LEARNING PLATFORM - SEED DATA SCRIPT
-- ============================================================================

-- 1. SUBSCRIPTION PLANS
INSERT INTO public.subscription_plans (id, name, code, rank, description, price_cents, duration_days, is_default, is_active)
VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        'Free Tier',
        'FREE',
        1,
        'Access to foundational summary notes, sample formula sheets, and introductory audio briefings.',
        0,
        365,
        true,
        true
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Pro Scholar',
        'PRO',
        2,
        'Unlocks full chapter PDFs, high-resolution reaction schematics, and structured audio lectures.',
        1999,
        30,
        false,
        true
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Premium Master',
        'PREMIUM',
        3,
        'Complete VIP access: advanced problem sets, masterclass audio recaps, exclusive exam guides, and priority materials.',
        4999,
        30,
        false,
        true
    )
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    rank = EXCLUDED.rank,
    description = EXCLUDED.description,
    price_cents = EXCLUDED.price_cents,
    is_default = EXCLUDED.is_default;

-- 2. COURSES
INSERT INTO public.courses (id, title, slug, code, description, thumbnail_url, is_published, order_index)
VALUES 
    (
        'c0000001-0000-0000-0000-000000000001',
        'Advanced Physics Mastery: Classical to Quantum',
        'advanced-physics-mastery',
        'PHY-301',
        'Rigorous conceptual and mathematical exploration of mechanics, electromagnetism, and modern quantum phenomena.',
        'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
        true,
        1
    ),
    (
        'c0000002-0000-0000-0000-000000000002',
        'Organic Chemistry & Reaction Mechanisms',
        'organic-chemistry-mechanisms',
        'CHM-204',
        'Deep dive into organic transformations, resonance structures, stereochemistry, and synthesis strategies.',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        true,
        2
    ),
    (
        'c0000003-0000-0000-0000-000000000003',
        'Higher Pure Mathematics & Linear Algebra',
        'higher-pure-mathematics',
        'MTH-105',
        'Vector spaces, matrix decompositions, eigenvalues, and abstract mathematical structures for competitive exams.',
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        true,
        3
    )
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = EXCLUDED.is_published;

-- 3. SUBJECTS
INSERT INTO public.subjects (id, course_id, title, slug, description, order_index)
VALUES 
    ('s0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Classical Mechanics & Dynamics', 'classical-mechanics', 'Newtonian kinematics, rotational dynamics, and planetary orbits.', 1),
    ('s0000002-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Electromagnetism & Optics', 'electromagnetism-optics', 'Coulombs law, Maxwells equations, and electromagnetic wave optics.', 2),
    ('s0000003-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000002', 'Aromatic Chemistry & Conjugation', 'aromatic-chemistry', 'Benzene ring activations, electrophilic substitutions, and Huckel rule.', 1),
    ('s0000004-0000-0000-0000-000000000003', 'c0000003-0000-0000-0000-000000000003', 'Vector Spaces & Transformations', 'vector-spaces', 'Basis, dimension, linear mappings, and null spaces.', 1)
ON CONFLICT (course_id, slug) DO NOTHING;

-- 4. CHAPTERS
INSERT INTO public.chapters (id, subject_id, title, slug, description, order_index)
VALUES 
    ('ch000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001', 'Rotational Equilibrium & Inertia', 'rotational-inertia', 'Center of mass calculations and parallel axis theorem.', 1),
    ('ch000002-0000-0000-0000-000000000001', 's0000002-0000-0000-0000-000000000001', 'Electromagnetic Radiation & Waves', 'em-radiation-waves', 'Poynting vectors, wave equations, and reflection coefficients.', 1),
    ('ch000003-0000-0000-0000-000000000002', 's0000003-0000-0000-0000-000000000002', 'Electrophilic Aromatic Substitution (EAS)', 'eas-mechanisms', 'Nitration, halogenation, and Friedel-Crafts alkylation.', 1),
    ('ch000004-0000-0000-0000-000000000003', 's0000004-0000-0000-0000-000000000003', 'Eigenvalues and Diagonalization', 'eigenvalues-diagonalization', 'Characteristic polynomials and diagonal forms.', 1)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- 5. TOPICS
INSERT INTO public.topics (id, chapter_id, title, slug, description, order_index)
VALUES 
    ('t0000001-0000-0000-0000-000000000001', 'ch000001-0000-0000-0000-000000000001', 'Angular Momentum & Precession', 'angular-momentum-precession', 'Torque vectors and gyroscope precession dynamics.', 1),
    ('t0000002-0000-0000-0000-000000000001', 'ch000002-0000-0000-0000-000000000001', 'Maxwells Equations in Differential Form', 'maxwells-equations', 'Gauss, Faraday, and Ampere laws unified.', 1),
    ('t0000003-0000-0000-0000-000000000002', 'ch000003-0000-0000-0000-000000000002', 'Arenium Ion Intermediate & Orientation', 'arenium-ion-orientation', 'Ortho/para vs meta directing resonance contributors.', 1),
    ('t0000004-0000-0000-0000-000000000003', 'ch000004-0000-0000-0000-000000000003', 'Spectral Theorem & Matrix Exponentiation', 'spectral-theorem', 'Orthogonal diagonalization and matrix series.', 1)
ON CONFLICT (chapter_id, slug) DO NOTHING;

-- 6. MATERIALS (PDFs, Images, Audio Lessons, Text Notes)
INSERT INTO public.materials (id, topic_id, title, description, type, access_level, status, order_index, content_text)
VALUES 
    -- 1. Free PDF
    (
        'm0000001-0000-0000-0000-000000000001',
        't0000001-0000-0000-0000-000000000001',
        'Rotational Dynamics: Essential Formula & Concept Handbook',
        'Quick summary sheet of moments of inertia, angular kinematics equations, and energy conservation proofs.',
        'pdf',
        'free',
        'published',
        1,
        NULL
    ),
    -- 2. Pro PDF
    (
        'm0000002-0000-0000-0000-000000000001',
        't0000001-0000-0000-0000-000000000001',
        'Advanced Gyroscopic Motion & Tensor Calculus Guide (Pro)',
        'Comprehensive 18-page derivation booklet covering Euler angles, inertia tensors, and non-inertial frame analysis.',
        'pdf',
        'pro',
        'published',
        2,
        NULL
    ),
    -- 3. Premium PDF
    (
        'm0000003-0000-0000-0000-000000000001',
        't0000002-0000-0000-0000-000000000001',
        'Maxwells Equations & Relativistic Electrodynamics (Premium VIP)',
        'Exclusive premium analytical masterclass note including 4-vector potential formulations and gauge invariance.',
        'pdf',
        'premium',
        'published',
        3,
        NULL
    ),
    -- 4. Free Image Schematic
    (
        'm0000004-0000-0000-0000-000000000002',
        't0000003-0000-0000-0000-000000000002',
        'Aromatic EAS Reaction Mechanism Pathway Map [Infographic]',
        'High-contrast visual roadmap showing electrophilic attack, Wheland intermediate, and catalyst regeneration.',
        'image',
        'free',
        'published',
        1,
        NULL
    ),
    -- 5. Pro Image Schematic
    (
        'm0000005-0000-0000-0000-000000000002',
        't0000003-0000-0000-0000-000000000002',
        'Resonance Delocalization & Substituent Effect Matrix (Pro)',
        'Detailed high-resolution structural diagrams analyzing electron donation vs withdrawal across ortho/meta/para positions.',
        'image',
        'pro',
        'published',
        2,
        NULL
    ),
    -- 6. Free Audio Lesson
    (
        'm0000006-0000-0000-0000-000000000001',
        't0000001-0000-0000-0000-000000000001',
        'Audio Lesson: Intuitive Understanding of Angular Momentum',
        'An engaging 12-minute audio explanation bridging linear momentum concepts to rotational dynamics.',
        'audio',
        'free',
        'published',
        1,
        NULL
    ),
    -- 7. Pro Audio Lesson
    (
        'm0000007-0000-0000-0000-000000000002',
        't0000003-0000-0000-0000-000000000002',
        'Masterclass Audio Recap: Cracking Tough Organic Synthesis Problems',
        'Step-by-step audio walkthrough on retro-synthetic analysis and preventing regiochemical side products.',
        'audio',
        'pro',
        'published',
        2,
        NULL
    ),
    -- 8. Premium Audio Lesson
    (
        'm0000008-0000-0000-0000-000000000003',
        't0000004-0000-0000-0000-000000000003',
        'VIP Podcast: Deep Eigenstructure, SVD & High-Dimensional Geometry',
        'Intensive conceptual discussion on singular value decomposition, Jordan forms, and quantum operator spectra.',
        'audio',
        'premium',
        'published',
        1,
        NULL
    ),
    -- 9. Free Text Note
    (
        'm0000009-0000-0000-0000-000000000003',
        't0000004-0000-0000-0000-000000000003',
        'Quick Review: 10 Fundamental Linear Algebra Theorems',
        'Essential definitions of basis, rank-nullity theorem, determinant multiplicativity, and invertible matrix equivalences.',
        'text_note',
        'free',
        'published',
        2,
        '# 10 Fundamental Linear Algebra Theorems\n\n### 1. Rank-Nullity Theorem\nFor any linear transformation $T: V \to W$ where $V$ is finite-dimensional:\n$$\\dim(\\ker T) + \\dim(\\text{im } T) = \\dim(V)$$\n\n### 2. Invertibility & Determinant\nAn $n \\times n$ matrix $A$ is invertible if and only if:\n- $\\det(A) \\neq 0$\n- $\\text{rank}(A) = n$\n- $0$ is NOT an eigenvalue of $A$\n- The columns of $A$ form a linearly independent basis for $\\mathbb{R}^n$\n\n### 3. Spectral Theorem for Symmetric Matrices\nIf $A$ is a real symmetric matrix ($A = A^T$), then:\n1. All eigenvalues of $A$ are real numbers.\n2. Eigenvectors corresponding to distinct eigenvalues are mutually orthogonal.\n3. There exists an orthogonal matrix $Q$ such that $Q^T A Q = \\Lambda$, where $\\Lambda$ is diagonal.'
    ),
    -- 10. Premium Text Note
    (
        'm0000010-0000-0000-0000-000000000003',
        't0000004-0000-0000-0000-000000000003',
        'Cayley-Hamilton Theorem & Minimal Polynomial Proofs (VIP)',
        'Rigorous mathematical proofs on matrix annihilators, invariant subspaces, and canonical form constructions.',
        'text_note',
        'premium',
        'published',
        3,
        '# Cayley-Hamilton Theorem & Minimal Polynomials\n\n### Theorem Statement\nEvery square matrix $A \\in M_n(F)$ satisfies its own characteristic equation:\n$$p_A(A) = 0$$\nwhere $p_A(\\lambda) = \\det(\\lambda I - A)$.\n\n### Construction of Jordan Normal Form\nLet $V$ be a finite-dimensional vector space over an algebraically closed field $F$. If $T: V \\to V$ is a linear operator whose characteristic polynomial splits, then $V$ can be decomposed into a direct sum of generalized eigenspaces:\n$$V = K_{\\lambda_1} \\oplus K_{\\lambda_2} \\oplus \\dots \\oplus K_{\\lambda_k}$$\nwhere $K_{\\lambda_i} = \\ker((T - \\lambda_i I)^{m_i})$.'
    )
ON CONFLICT (id) DO NOTHING;

-- 7. MATERIAL FILES (Private storage pointers)
INSERT INTO public.material_files (id, material_id, bucket_name, file_path, original_filename, mime_type, size_bytes, page_count, duration_seconds)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000001', 'study-materials', 'physics/rotational_formula_sheet_v1.pdf', 'Rotational_Dynamics_Summary.pdf', 'application/pdf', 1428500, 6, NULL),
    ('f0000002-0000-0000-0000-000000000001', 'm0000002-0000-0000-0000-000000000001', 'study-materials', 'physics/advanced_gyroscopic_tensor_pro.pdf', 'Gyroscopic_Motion_Tensors.pdf', 'application/pdf', 3845000, 18, NULL),
    ('f0000003-0000-0000-0000-000000000001', 'm0000003-0000-0000-0000-000000000001', 'study-materials', 'physics/maxwell_relativistic_electrodynamics.pdf', 'Relativistic_Electrodynamics_Master.pdf', 'application/pdf', 6210000, 32, NULL),
    ('f0000004-0000-0000-0000-000000000002', 'm0000004-0000-0000-0000-000000000002', 'study-materials', 'chemistry/eas_mechanism_roadmap_hires.png', 'EAS_Mechanism_Map.png', 'image/png', 2140000, 1, NULL),
    ('f0000005-0000-0000-0000-000000000002', 'm0000005-0000-0000-0000-000000000002', 'study-materials', 'chemistry/resonance_substituent_matrix.png', 'Resonance_Matrix_Pro.png', 'image/png', 3450000, 1, NULL),
    ('f0000006-0000-0000-0000-000000000001', 'm0000006-0000-0000-0000-000000000001', 'study-materials', 'audio/physics_rotational_intro_lesson.mp3', 'Angular_Momentum_Briefing.mp3', 'audio/mpeg', 8450000, NULL, 720),
    ('f0000007-0000-0000-0000-000000000002', 'm0000007-0000-0000-0000-000000000002', 'study-materials', 'audio/chemistry_eas_synthesis_recap.mp3', 'EAS_Synthesis_Masterclass.mp3', 'audio/mpeg', 14500000, NULL, 1140),
    ('f0000008-0000-0000-0000-000000000003', 'm0000008-0000-0000-0000-000000000003', 'study-materials', 'audio/math_svd_high_dim_geometry.mp3', 'SVD_Geometry_VIP.mp3', 'audio/mpeg', 19800000, NULL, 1560)
ON CONFLICT (id) DO NOTHING;
