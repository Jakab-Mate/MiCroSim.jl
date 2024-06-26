function non_zero_pos(A)
    indices = findall(x -> x != 0, A)
    tuple_indices = Tuple.(indices)
    return tuple_indices
end

function normalize(A; h::Real=0)
    if isempty(A)
        throw(DomainError("Cannot normalize an empty array."))
    else
        if sum(A) == 0
            throw(DomainError("Cannot normalize an array that sums to zero."))
        end
    end

    if h == 0
        return A ./ sum(A)
    else
        return A ./ sum(A .^ h)
    end
           
end

function sample_reaction_indices(rng, D, number_of_reactions)
    total_different_reactions = length(non_zero_pos(D))
    if total_different_reactions < number_of_reactions
        throw(DomainError("Number of sampled reactions ($number_of_reactions) should be smaller than the total number of reactions ($total_different_reactions)"))
    end

    helper_D = copy(D)
    chosen_indices = Array{Tuple}(undef, number_of_reactions)
    for i in 1:number_of_reactions
        choice = rand(rng, non_zero_pos(helper_D))
        chosen_indices[i] = choice
        #excluding production and consumption of the same resource
        #helper_D[:, choice[1]] .= 0
        #helper_D[choice[2], :] .= 0
        helper_D[choice[1], choice[2]] = 0
    end

    return chosen_indices
end