mutable struct ParamStruct
    n_species::Int64
    n_resources::Int64
    present_species::Array{Int64}
    C::Array{Float64, 3}
    D::Matrix{Int64}
    W_ba::Matrix{Float64}
    n_reactions::Array{Int64}
    n_splits::Array{Float64}
    m::Array{Float64}
    phi::Float64
    eta::Float64
    tau::Array{Float64}
    alpha::Array{Float64}
    a::Array{Float64}
    k::Array{Float64}
    host_regulation::Bool

end


struct PoolStruct
    pool::Array{Float64, 3}
    family_ids::Array{Int64}
    m::Array{Float64}
    n_reactions::Array{Int64}
    n_splits::Array{Float64}
    a::Array{Float64}
    k::Array{Float64}

end


struct SampleStruct
    n_species::Int64
    n_invaders::Int64
    C::Array{Float64, 3}
    family_ids::Array{Int64}
    m::Array{Float64}
    n_reactions::Array{Int64}
    n_splits::Array{Float64}
    species_abundance::Array{Float64}
    resource_abundance::Array{Float64}
    a::Array{Float64}
    k::Array{Float64}

end