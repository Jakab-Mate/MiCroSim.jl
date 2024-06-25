function generic_run(sample::sample_struct;
    D = nothing,
    W_ba = nothing,
    path::String=homedir(),
    t_span::Tuple{Int64, Int64}=(0, 1000), 
    t_inv::Float64=25.0, 
    t_inv_0::Float64=100.0, 
    cutoff::Float64=0.0001, 
    phi::Float64=0.1, 
    eta::Float64=0.1, 
    tau::Union{Vector{Float64}, Nothing}=nothing, 
    alpha::Union{Vector{Float64}, Nothing}=nothing,
    plot::Bool=true,
    host_regulation::Bool=true)

    if isnothing(D)
        D, W_ba = create_metabolism()
        if !isnothing(W_ba)
            println("WARNING: Supplied energy yield matrix (W_ba) but no stoichiometric matrix (D). Overwriting W_ba to ensure compatibility")
        end
    else
        if isnothing(W_ba)
            D, W_ba = create_metabolism()
            println("WARNING: Supplied stoichiometric matrix (D) but no energy yield matrix (W_ba). Overwriting D to ensure compatibility")
        end
    end

    n_resources = size(D, 1)

    D_row, D_col = size(D)
    if (n_resources != D_row) || (n_resources != D_col)
        throw(DomainError("Number of resources does not match the size of the stoichiometric matrix (D) \n 
        number of resources is $n_resources, sizes of D are ($D_row, $D_col)"))
    end

    W_row, W_col = size(W_ba)
    if (n_resources != W_row) || (n_resources != W_col)
        throw(DomainError("Number of resources does not match the size of the energy yield matrix (W_ba) \n 
        number of resources is $n_resources, sizes of D are ($W_row, $W_col)"))
    end

    if isnothing(tau)
        tau = ones(Float64, n_resources)
    end

    if isnothing(alpha)
        alpha = vcat([100.0], zeros(Float64, n_resources-1))
    end

    n_species = sample.n_species
    n_invaders = sample.n_invaders

    u0 = vcat(sample.species_abundance, sample.resource_abundance)
    params = param_struct(n_species+n_invaders, n_resources, 1:n_species, sample.C, D, W_ba, sample.n_reactions, sample.n_splits, sample.m, phi, eta, tau, alpha, sample.a, sample.k, host_regulation)

    prob = ODEProblem(equations, u0, t_span, params)
    cb = create_callbacks(t_inv, t_inv_0, n_invaders, n_species, cutoff)
    solution = solve(prob, KenCarp4(autodiff=false), abstol = 1e-10, reltol = 1e-10; saveat=1, callback=cb)

    t = solution.t
    Xapp = hcat(map(u -> u[1:(n_species+n_invaders)], solution.u)...)
    assays = OrderedDict{String, AbstractArray}("sim" => Xapp);
    rowdata = DataFrame(
        name = ["strain$i" for i in 1:(n_species+n_invaders)],
        family = ["family$i" for i in sample.family_ids],
        n_reactions = ["$i reactions" for i in sample.n_reactions],
        n_splits = ["$i splits" for i in sample.n_splits]
    );
    coldata = DataFrame(
        name = ["t$i" for i in 1:length(t)],
        condition = rand(["lake", "ocean", "river"], length(t)), # just a placeholder
        time = 1:length(t)
    );

    se = SummarizedExperiment(assays, rowdata, coldata);
    if plot
        plot_se(se, "sim", path)
        plot_MCI(se, "sim", path)
    end
    return se

end
