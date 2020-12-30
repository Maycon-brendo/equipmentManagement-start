package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.StoreEquipment;
import java.util.List;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.Store;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the StoreEquipment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoreEquipmentRepository extends JpaRepository<StoreEquipment, Long>, JpaSpecificationExecutor<StoreEquipment> {
    public List<StoreEquipment>  findAllByEquipmentNameIgnoreCaseAndStore(String equipmentName, Store store);

    public Boolean existsByEquipmentNameIgnoreCaseAndStore(String equipmentName, Store store);
}
