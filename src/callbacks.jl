function affect!(integrator, t_inv, start_time, n_invaders, n_species, cutoff)
    integrator.p.present_species = findall(x -> x > cutoff, integrator.u[1:(n_species+n_invaders)])
    if integrator.t >= start_time
        idx = Int(n_species + floor((integrator.t - start_time) / t_inv)) + 1
        if idx <= n_invaders + n_species
            println("invader ", idx-n_species, " added at time ", integrator.t)
            integrator.u[idx] += 10
        end
    end
end

function create_callbacks(t_inv, start_time, n_invaders, n_species, cutoff)
    cb = PeriodicCallback(
        integrator -> affect!(integrator, t_inv, start_time, n_invaders, n_species, cutoff), t_inv
    )
    return cb
end

