import os

base_dir = r"c:\Users\Tiran's PC\Downloads\Travel_and_Tourism_Management_System-main\Travel_and_Tourism_Management_System-main\backend\src\main\java\com\tourism"

modules = [
    {"name": "user", "entity": "User", "type": "Long", "var": "user"},
    {"name": "booking", "entity": "Booking", "type": "Long", "var": "booking"},
    {"name": "finance", "entity": "FinanceRecord", "type": "Long", "var": "financeRecord"},
    {"name": "guide", "entity": "Guide", "type": "Long", "var": "guide"},
    {"name": "pricing", "entity": "Payment", "type": "Long", "var": "payment"},
    {"name": "rides", "entity": "RideRequest", "type": "Long", "var": "rideRequest"}
]

for mod in modules:
    mod_dir = os.path.join(base_dir, mod["name"])
    os.makedirs(os.path.join(mod_dir, "repository"), exist_ok=True)
    os.makedirs(os.path.join(mod_dir, "service"), exist_ok=True)
    os.makedirs(os.path.join(mod_dir, "controller"), exist_ok=True)

    # Repository
    repo_code = f"""package com.tourism.{mod['name']}.repository;

import com.tourism.{mod['name']}.entity.{mod['entity']};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {mod['entity']}Repository extends JpaRepository<{mod['entity']}, {mod['type']}> {{
}}
"""
    with open(os.path.join(mod_dir, "repository", f"{mod['entity']}Repository.java"), "w") as f:
        f.write(repo_code)

    # Service
    service_code = f"""package com.tourism.{mod['name']}.service;

import com.tourism.{mod['name']}.entity.{mod['entity']};
import com.tourism.{mod['name']}.repository.{mod['entity']}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class {mod['entity']}Service {{

    @Autowired
    private {mod['entity']}Repository repository;

    public List<{mod['entity']}> getAll() {{
        return repository.findAll();
    }}

    public {mod['entity']} getById({mod['type']} id) {{
        return repository.findById(id).orElse(null);
    }}

    public {mod['entity']} save({mod['entity']} {mod['var']}) {{
        return repository.save({mod['var']});
    }}

    public void delete({mod['type']} id) {{
        repository.deleteById(id);
    }}
}}
"""
    with open(os.path.join(mod_dir, "service", f"{mod['entity']}Service.java"), "w") as f:
        f.write(service_code)

    # Controller
    controller_code = f"""package com.tourism.{mod['name']}.controller;

import com.tourism.{mod['name']}.entity.{mod['entity']};
import com.tourism.{mod['name']}.service.{mod['entity']}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{mod['name']}s")
@CrossOrigin(origins = "*")
public class {mod['entity']}Controller {{

    @Autowired
    private {mod['entity']}Service service;

    @GetMapping
    public List<{mod['entity']}> getAll() {{
        return service.getAll();
    }}

    @GetMapping("/{{id}}")
    public {mod['entity']} getById(@PathVariable {mod['type']} id) {{
        return service.getById(id);
    }}

    @PostMapping
    public {mod['entity']} create(@RequestBody {mod['entity']} {mod['var']}) {{
        return service.save({mod['var']});
    }}

    @PutMapping("/{{id}}")
    public {mod['entity']} update(@PathVariable {mod['type']} id, @RequestBody {mod['entity']} {mod['var']}) {{
        {mod['var']}.setId(id);
        return service.save({mod['var']});
    }}

    @DeleteMapping("/{{id}}")
    public void delete(@PathVariable {mod['type']} id) {{
        service.delete(id);
    }}
}}
"""
    with open(os.path.join(mod_dir, "controller", f"{mod['entity']}Controller.java"), "w") as f:
        f.write(controller_code)

print("Generated boilerplate for all modules.")
