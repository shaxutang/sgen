
import clsx from "clsx";
import { VariablesModalButtonProps } from "./type";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Card, CardHeader, CardBody, useDisclosure } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { Sgenrc } from '@vcee/sgen-types'

type Variable = {
  id: string;
  name: string;
  value: string;
}

export default function VariablesModalButton({ children, className, ...rest }: VariablesModalButtonProps) {
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [sgenrc, setSgenrc] = useState<Sgenrc>({
   username:"",
   email:""
  })

  const [otherVariables, setOtherVariables] = useState<Variable[]>([])

  const variables = useMemo(() => {
    const variables: Record<string, any> = { sgenrc }
    otherVariables
      .forEach(({ name, value }) => {
        variables[name] = value
      })
    return variables
  }, [otherVariables, sgenrc])

  function input(name: string, value: string, id: string) {
    const variableIndex = otherVariables.findIndex(variable => variable.id === id)
    if (variableIndex !== -1) {
      otherVariables[variableIndex] = {
        ...otherVariables[variableIndex],
        name,
        value
      }
      setOtherVariables([...otherVariables])
    }
  }

  function add() {
    const variable: Variable = {
      id: crypto.randomUUID(),
      name: "",
      value: ""
    }
    otherVariables.push(variable);
    setOtherVariables([...otherVariables])
  }

  function remove(id: string) {
    otherVariables.splice(otherVariables.findIndex(variable => variable.id === id), 1)
    setOtherVariables([...otherVariables])
  }

  function save() {
    console.log(variables)
  }

  return (
    <>
      <Button color="primary" className={clsx(className)} {...rest} onPress={onOpen}>
        variables
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Variables</ModalHeader>
              <ModalBody>
                <Card shadow="none" className="border border-dashed">
                  <CardHeader>.sgenrc</CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      size="sm"
                      type="text"
                      label="username"
                      value={sgenrc.username}
                      autoFocus
                      onValueChange={(value) => setSgenrc({ ...sgenrc, username: value })}
                    />
                    <Input
                      size="sm"
                      type="email"
                      label="email"
                      value={sgenrc.email}
                      onValueChange={(value) => setSgenrc({ ...sgenrc, email: value })}
                    />
                  </CardBody>
                </Card>
                <Card shadow="none" className="border border-dashed">
                  <CardHeader>Other Variables</CardHeader>
                  <CardBody className="space-y-4">
                    {
                      otherVariables.map((variable) => (
                        <div className="grid grid-cols-12 gap-x-4 items-center" key={variable.id}>
                          <Input
                            size="sm"
                            type="text"
                            label="name"
                            className="col-span-2"
                            onValueChange={(value) => input(value, variable.value, variable.id)}
                          />
                          <Input
                            size="sm"
                            type="text"
                            label="value"
                            className="col-span-9"
                            onValueChange={(value) => input(variable.name, value, variable.id)}
                          />
                          <Button
                            isIconOnly
                            variant="light"
                            className="col-span-1"
                            onPress={() => remove(variable.id)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </Button>
                        </div>
                      ))
                    }
                    <Button isIconOnly onPress={add}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={save}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

}