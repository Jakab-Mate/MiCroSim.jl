using MiCroSim
using Test
using Random

### helper_functions.jl
@testset "Testing non_zero_pos" begin
    @test MiCroSim.non_zero_pos([1, 0, 3]) == [(1,), (3,)]
    @test MiCroSim.non_zero_pos([0, 0, 0]) == []
    @test MiCroSim.non_zero_pos([1, 2, 3]) == [(1,), (2,), (3,)]
    @test MiCroSim.non_zero_pos([0 1; 0 3]) == [(1, 2), (2, 2)]
    
    # Edge cases
    @test MiCroSim.non_zero_pos([]) == []
end

@testset "Testing normalize" begin
    @test MiCroSim.normalize([1, 2, 3]) == [1/6, 1/3, 1/2]
    @test MiCroSim.normalize([1, 2, 3], h=1) == [1/6, 1/3, 1/2]
    @test MiCroSim.normalize([1, 2, 3], h=2) == [1/14, 2/14, 3/14]
    @test MiCroSim.normalize([0, 6, 0], h=2) == [0, 6/36, 0]
    
    # Edge cases
    @test_throws DomainError MiCroSim.normalize([])
    @test_throws DomainError MiCroSim.normalize([0])
    @test_throws DomainError MiCroSim.normalize([1, 0, -1])
end

@testset "Testing sample_reaction_indices" begin
    rng = MersenneTwister(1234)
    D = [0 1 0; 0 0 1; 1 0 0]
    @test MiCroSim.sample_reaction_indices(rng, D, 2) == [(1, 2), (2, 3)]
    @test MiCroSim.sample_reaction_indices(rng, D, 3) == [(2, 3), (1, 2), (3, 1)]
    
    # Edge cases
    @test_throws DomainError MiCroSim.sample_reaction_indices(rng, D, 4)
end

### generative_functions.jl
@testset "Testing create_metabolism" begin
    n_levels = 5
    n_resources = 10
    D, W_ba = create_metabolism(n_resources=n_resources, n_levels=n_levels, energy_yields="Uniform_1")
    @test size(D) == (10, 10)
    @test size(W_ba) == (10, 10)
    @test length(D[:,1]) == n_resources
    @test length(W_ba[:,1]) == n_resources
    @test length(D[1,:]) == n_resources
    @test length(W_ba[1,:]) == n_resources
    @test length(Set(D[:,1])) == n_levels

    for i in 1:n_resources
        for j in 1:n_resources
            D[i, j] >= 0
            W_ba[i, j] >= 0 # Not allowing reactions that require energy
            if i == j
                @test D[i, j] == 0
                @test W_ba[i, j] == 0
            end
        end
    end

    # Edge cases
    @test_throws DomainError create_metabolism(n_resources=1, n_levels=1)
    @test_throws DomainError create_metabolism(n_resources=5, n_levels=10)
end

@testset "Testing create_species_pool" begin
    D, W_ba = create_metabolism()
    p = create_species_pool(D, n_families=5, family_size=100)
    @test size(p.pool) == (10, 10, 500)
    @test size(p.family_ids) == (500,)
    @test size(p.m) == (500,)
    @test size(p.n_reactions) == (500,)
    @test size(p.n_splits) == (500,)
    @test size(p.a) == (500,)
    @test size(p.k) == (500,)

    for i in 1:500
        @test p.family_ids[i] >= 1
        @test p.family_ids[i] <= 5
        @test p.m[i] >= 0
        @test p.n_reactions[i] >= 0
        @test p.n_splits[i] >= 0
        @test p.a[i] >= 0
        @test p.k[i] >= 0
    end
end

### sample_pool.jl
@testset "Testing sample_pool" begin
    D, W_ba = create_metabolism()
    p = create_species_pool(D, n_families=5, family_size=100)
    sample = sample_pool(p, 1, 1)
    @test sample isa MiCroSim.SampleStruct
    @test size(sample.C) == (10, 10, 2)
    @test size(sample.family_ids) == (2,)
    @test size(sample.m) == (2,)
    @test size(sample.n_reactions) == (2,)
    @test size(sample.n_splits) == (2,)
    @test size(sample.a) == (2,)
    @test size(sample.k) == (2,)
    @test size(sample.species_abundance) == (2,)
    @test size(sample.resource_abundance) == (10,)    
    
    # Edge cases

    @test_throws DomainError sample_pool(MiCroSim.PoolStruct(zeros(1, 1, 1), [1], [1], [1], [1], [1], [1]), 1, 1)
end

### equations.jl
@testset "Testing equations" begin
    u = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    #params = ParamStruct(n_species+n_invaders, n_resources, 1:n_species, sample.C, D, W_ba, sample.n_reactions, sample.n_splits, sample.m, phi, eta, tau, alpha, sample.a, sample.k, host_regulation)
    p = MiCroSim.ParamStruct(10, 10, 1:10, ones(10, 10, 10), ones(10, 10), ones(10, 10), ones(10), ones(10), ones(10), 1, 1, ones(10), ones(10), ones(10), ones(10), true)
    t = 0
    out = MiCroSim.equations(u, p, t)
    @test size(out) == (20,)

end